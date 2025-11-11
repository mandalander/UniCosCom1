'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "./language-provider";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, Query } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

type Community = {
  id: string;
  name: string;
  description: string;
};

export function CommunityList() {
  const { t } = useLanguage();
  const firestore = useFirestore();

  const communitiesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'communities')) as Query<Community>;
  }, [firestore]);

  const { data: communities, isLoading, error } = useCollection<Community>(communitiesQuery);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t('homeTitle')}</h2>
      {isLoading && (
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-6 w-1/2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4 mt-2" />
                    </CardContent>
                </Card>
            ))}
         </div>
      )}
      {!isLoading && !error && communities && communities.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {communities.map((community) => (
            <Card key={community.id}>
              <CardHeader>
                <CardTitle>{community.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{community.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !isLoading && !error ? (
        <p>Nie utworzono jeszcze żadnych społeczności.</p>
      ) : null}
       {error && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-destructive">Could not load communities. The security rules may be misconfigured.</p>
            </CardContent>
          </Card>
      )}
    </div>
  );
}