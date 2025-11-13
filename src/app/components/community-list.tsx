'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "./language-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { CommunityWithPosts } from "./community-with-posts";

type Community = {
  id: string;
  name: string;
  description: string;
  createdAt?: any;
};

export function CommunityList() {
  const { t } = useLanguage();
  const firestore = useFirestore();

  const communitiesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'communities'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: communities, isLoading } = useCollection<Community>(communitiesQuery);

  if (isLoading) {
    return (
       <div className="space-y-8">
        <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">{t('communitiesTitle')}</h2>
            <Skeleton className="h-6 w-12" />
        </div>
        <div className="space-y-6">
          {[...Array(2)].map((_, i) => (
             <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-4">
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
       <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">{t('communitiesTitle')}</h2>
            {communities && <span className="text-2xl font-bold text-muted-foreground">({communities.length})</span>}
      </div>
      {communities && communities.length > 0 ? (
        <div className="space-y-8">
          {communities.map((community) => (
            <CommunityWithPosts key={community.id} community={community} />
          ))}
        </div>
      ) : (
        <p>{t('noCommunitiesYet')}</p>
      )}
    </div>
  );
}
