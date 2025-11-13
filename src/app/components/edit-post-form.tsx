'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useLanguage } from './language-provider';
import { useFirestore, updateDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

type Post = {
  id: string;
  title: string;
  content: string;
};

interface EditPostFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  communityId: string;
  post: Post;
}

export function EditPostForm({ isOpen, onOpenChange, communityId, post }: EditPostFormProps) {
  const { t } = useLanguage();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const FormSchema = z.object({
    title: z.string().min(3, { message: t('postTitleMinLength') }),
    content: z.string().min(1, { message: t('postContentMinLength') }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: post.title,
      content: post.content,
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (!firestore) return;
    setIsSubmitting(true);

    const postRef = doc(firestore, 'communities', communityId, 'posts', post.id);
    updateDocumentNonBlocking(postRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    toast({ description: t('updatePostSuccess') });
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('editPostTitle')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('postTitle')}</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('postContent')}</FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled={isSubmitting} rows={6} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('updating') : t('update')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
