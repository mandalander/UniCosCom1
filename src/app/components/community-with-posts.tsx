'use client';

import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/app/components/language-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { pl, enUS } from 'date-fns/locale';

type Community = {
  id: string;
  name: string;
  description: string;
};

type Post = {
  id: string;
  title: string;
  creatorDisplayName: string;
  creatorPhotoURL?: string;
  createdAt: any;
};

interface CommunityWithPostsProps {
  community: Community;
}

export function CommunityWithPosts({ community }: CommunityWithPostsProps) {
  const { t, language } = useLanguage();
  const firestore = useFirestore();

  const postsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'communities', community.id, 'posts'), orderBy('createdAt', 'desc'), limit(3));
  }, [firestore, community.id]);

  const { data: posts, isLoading } = useCollection<Post>(postsQuery);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return formatDistanceToNow(date, { addSuffix: true, locale: language === 'pl' ? pl : enUS });
  };
  
  const getInitials = (name?: string | null) => {
    return name ? name.charAt(0).toUpperCase() : <User className="h-5 w-5" />;
  };

  return (
    <Card>
      <CardHeader>
        <Link href={`/community/${community.id}`} passHref>
          <CardTitle className="cursor-pointer hover:underline">{community.name}</CardTitle>
        </Link>
        <CardDescription>{community.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <h4 className="text-md font-semibold text-muted-foreground">{t('latestPosts')}</h4>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-12 w-full animate-pulse rounded-md bg-muted"></div>
            <div className="h-12 w-full animate-pulse rounded-md bg-muted"></div>
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="space-y-2">
            {posts.map(post => (
              <Link key={post.id} href={`/community/${community.id}/post/${post.id}`} passHref>
                <div className="flex items-center gap-3 rounded-md border p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                  <Avatar className="h-9 w-9">
                      <AvatarImage src={post.creatorPhotoURL} />
                      <AvatarFallback>{getInitials(post.creatorDisplayName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold truncate">{post.title}</p>
                    <p className="text-xs text-muted-foreground">
                        {t('postedBy', { name: post.creatorDisplayName })} - {formatDate(post.createdAt)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t('noPostsYet')}</p>
        )}
      </CardContent>
    </Card>
  );
}
