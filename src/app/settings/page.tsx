'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState('pl');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ustawienia</CardTitle>
        <CardDescription>
          Zarządzaj ustawieniami konta i aplikacji.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between">
          <Label>Motyw</Label>
          <div className="flex gap-2">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              onClick={() => setTheme('light')}
            >
              Jasny
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              onClick={() => setTheme('dark')}
            >
              Ciemny
            </Button>
            <Button
              variant={theme === 'system' ? 'default' : 'outline'}
              onClick={() => setTheme('system')}
            >
              Systemowy
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Label>Język</Label>
          <div className="flex gap-2">
            <Button
              variant={language === 'en' ? 'default' : 'outline'}
              onClick={() => setLanguage('en')}
            >
              Angielski
            </Button>
            <Button
              variant={language === 'pl' ? 'default' : 'outline'}
              onClick={() => setLanguage('pl')}
            >
              Polski
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
