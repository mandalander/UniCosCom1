'use client';
import { CommunityList } from "./components/community-list";
import { useLanguage } from "./components/language-provider";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto">
      <CommunityList />
    </div>
  );
}
