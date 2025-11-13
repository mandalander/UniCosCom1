'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useLanguage } from './language-provider';
import { useFirestore, updateDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

type Comment = {
  id: string;
  content: string;
};

interface EditCommentFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  communityId: string;
  postId: string;
  comment: Comment;
}

export function EditCommentForm({ isOpen, onOpenChange, communityId, postId, comment }: EditCommentFormProps) {
  const { t } = useLanguage();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const FormSchema = z.object({
    content: z.string().min(1, { message: t('commentCannotBeEmpty') }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      content: comment.content,
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (!firestore) return;
    setIsSubmitting(true);

    const commentRef = doc(firestore, 'communities', communityId, 'posts', postId, 'comments', comment.id);
    updateDocumentNonBlocking(commentRef, {
      content: data.content,
      updatedAt: serverTimestamp(),
    });

    toast({ description: t('updateCommentSuccess') });
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('editCommentTitle')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('postContent')}</FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled={isSubmitting} rows={4} />
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
