'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/app/components/language-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { pl, enUS } from 'date-fns/locale';

type Comment = {
  id: string;
  content: string;
  creatorDisplayName: string;
  creatorPhotoURL?: string;
  createdAt: any;
};

interface CommentListProps {
    communityId: string;
    postId: string;
}

export function CommentList({ communityId, postId }: CommentListProps) {
  const { t, language } = useLanguage();
  const firestore = useFirestore();

  const commentsColRef = useMemoFirebase(() => {
    if (!firestore || !communityId || !postId) return null;
    return query(collection(firestore, 'communities', communityId, 'posts', postId, 'comments'), orderBy('createdAt', 'asc'));
  }, [firestore, communityId, postId]);

  const { data: comments, isLoading } = useCollection<Comment>(commentsColRef);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return formatDistanceToNow(date, { addSuffix: true, locale: language === 'pl' ? pl : enUS });
  };

  const getInitials = (name?: string | null) => {
    return name ? name.charAt(0).toUpperCase() : <User className="h-5 w-5" />;
  };

  if (isLoading) {
    return (
       <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
            <Card key={i}>
                <CardHeader className='flex-row items-center gap-3 space-y-0'>
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                </CardContent>
            </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comments && comments.length > 0 ? (
        comments.map((comment) => (
          <Card key={comment.id}>
             <CardHeader className='flex-row items-center gap-3 space-y-0'>
                <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.creatorPhotoURL} />
                    <AvatarFallback>{getInitials(comment.creatorDisplayName)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{comment.creatorDisplayName}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</p>
                </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>{t('noCommentsYet')}</p>
      )}
    </div>
  );
}
