import React from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { CheckCircle2 } from 'lucide-react';

export function LevelSelector({ 
  currentLevel, 
  highestUnlockedLevel, 
  levelProgress, 
  onSelectLevel,
  onError 
}) {
  
  const handleSelect = (level) => {
    const result = onSelectLevel(level);
    if (result?.error && onError) {
      onError(result.error);
    }
  };

  return (
    <Card className="mb-6 bg-white/90 border border-slate-200">
      <CardHeader>
        <CardTitle>Select Level</CardTitle>
        <CardDescription>Choose a level to begin your challenge</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 items-center">
          {[1, 2, 3, 4, 5].map((level) => {
            const isCompleted = !!levelProgress[level]?.completed;
            const isCurrent = currentLevel === level;
            const isLocked = level > highestUnlockedLevel;

            return (
              <Button
                key={level}
                variant={isCompleted ? "default" : "outline"}
                size="lg"
                onClick={() => handleSelect(level)}
                disabled={isLocked}
                className={[
                  "min-w-[120px] flex items-center gap-2 transition-all",
                  isCompleted
                    ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
                    : "",
                  isCurrent && !isLocked
                    ? "ring-2 ring-purple-400"
                    : "",
                  isLocked
                    ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                    : ""
                ].join(" ")}
              >
                Level {level}
                {isCompleted && !isLocked && (
                  <CheckCircle2 className="w-4 h-4" />
                )}
              </Button>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap justify-between items-center text-sm text-slate-600 gap-2">
          <span>
            Progress:{" "}
            <strong>
              {Object.values(levelProgress).filter(l => l?.completed).length}/5
            </strong>{" "}
            levels conquered
          </span>
          <span>
            Highest unlocked:{" "}
            <strong>Level {highestUnlockedLevel}</strong>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
