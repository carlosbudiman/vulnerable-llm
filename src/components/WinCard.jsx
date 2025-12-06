import React from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { RefreshCcw } from 'lucide-react';

export function WinCard({ 
  discoveredPassword, 
  currentLevel, 
  onNextLevel, 
  onRestart, 
  onReplay 
}) {
  return (
    <Card className="border border-green-500/40 bg-green-50 text-green-900">
      <CardHeader>
        <CardTitle className="text-green-700 flex items-center gap-2">
          🎉 Password Breached!
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-2xl font-bold text-green-800">
            Password: {discoveredPassword || 'Captured in the dialogue above'}
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {currentLevel < 5 ? (
              <Button
                onClick={onNextLevel}
                className="w-full"
              >
                Advance to Level {currentLevel + 1}
              </Button>
            ) : (
              <Button
                onClick={onRestart}
                className="w-full"
              >
                Restart from Level 1
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={onReplay}
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Replay This Level
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
