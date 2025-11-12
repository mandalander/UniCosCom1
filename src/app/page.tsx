'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "./components/language-provider";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
          <p className="mb-4">
            {t('homeContent1')}
          </p>
          <p>
            {t('homeContent3')}
          </p>
          <Button asChild className="mt-4">
            <Link href="/explore">{t('explore')}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
