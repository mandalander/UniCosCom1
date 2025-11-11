'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "./language-provider";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";

export function CommunityList() {
  const { t } = useLanguage();
  const firestore = useFirestore();

  const communitiesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "communities"));
  }, [firestore]);

  const { data: communities, isLoading } = useCollection(communitiesQuery);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t('homeTitle')}</h2>
      {!isLoading && communities && communities.length > 0 ? (
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
      ) : isLoading ? (
        <p>Ładowanie społeczności...</p>
      ) : (
        <p>Nie utworzono jeszcze żadnych społeczności.</p>
      )}
    </div>
  );
}