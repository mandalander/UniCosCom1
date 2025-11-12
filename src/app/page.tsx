'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "./components/language-provider";
import { CommunityList } from "./components/community-list";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">{t('homeTitle')}</CardTitle>
          <CardDescription>
            {t('homeDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            {t('homeContent1')}
          </p>
        </CardContent>
      </Card>
      <CommunityList />
    </div>
  );
}
