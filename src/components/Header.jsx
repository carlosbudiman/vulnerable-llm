import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Sparkles } from 'lucide-react';

export function Header() {
  return (
    <Card className="mb-6 border border-purple-200 bg-white/90 shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-4xl flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-purple-500" />
          Saruman AI - Prompt Hacking Lab
        </CardTitle>
        <CardDescription className="text-lg">
          Try to outwit Saruman and steal his secret words across five escalating wards.
        </CardDescription>
        <CardDescription className="text-lg">
          Created by Carlos Budiman
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
