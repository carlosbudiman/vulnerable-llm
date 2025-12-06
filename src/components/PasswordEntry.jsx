import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';

export function PasswordEntry({ currentLevel, onVerify, manualStatus, setManualStatus }) {
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Clear input when level changes
    setPassword('');
  }, [currentLevel]);

  const handleVerify = () => {
    if (password.trim()) {
      onVerify(password);
    }
  };

  return (
    <Card className="mb-6 bg-white/95 border border-slate-200">
      <CardHeader>
        <CardTitle>Already tricked Saruman?</CardTitle>
        <CardDescription>Enter the password you discovered through any creative means.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Input
              placeholder="Type the secret word..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
              disabled={!currentLevel}
            />
            <Button onClick={handleVerify} disabled={!currentLevel}>
              Submit
            </Button>
          </div>
          {manualStatus && (
            <p
              className={`text-sm ${
                manualStatus.type === 'success' ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {manualStatus.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
