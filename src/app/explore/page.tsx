'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "../components/language-provider";

export default function ExplorePage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('exploreTitle')}</CardTitle>
          <CardDescription>{t('exploreDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{t('exploreContent')}</p>
        </CardContent>
      </Card>
    </div>
  )
}
