import React, { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { Header } from './components/Header';
import { LevelSelector } from './components/LevelSelector';
import { ChatInterface } from './components/ChatInterface';
import { PasswordEntry } from './components/PasswordEntry';
import { WinCard } from './components/WinCard';
import { Card, CardContent } from './components/ui/card';

function App() {
  const {
    currentLevel,
    highestUnlockedLevel,
    levelProgress,
    messages,
    levelInfo,
    isLoading,
    passwordFound,
    discoveredPassword,
    selectLevel,
    sendMessage,
    verifyPassword
  } = useGameState();

  const [manualStatus, setManualStatus] = useState(null);

  const handleSelectLevel = (level) => {
    const result = selectLevel(level);
    if (result?.error) {
      setManualStatus({ type: 'error', message: result.error });
    } else {
      setManualStatus(null);
    }
  };

  const handleVerifyPassword = async (password) => {
    const result = await verifyPassword(password);
    if (result.success) {
      setManualStatus({ type: 'success', message: result.message });
    } else {
      setManualStatus({ type: 'error', message: result.error });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 text-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header />

        <LevelSelector
          currentLevel={currentLevel}
          highestUnlockedLevel={highestUnlockedLevel}
          levelProgress={levelProgress}
          onSelectLevel={handleSelectLevel}
          onError={(msg) => setManualStatus({ type: 'error', message: msg })}
        />

        {/* Main Game Area */}
        {currentLevel ? (
          <ChatInterface
            currentLevel={currentLevel}
            levelInfo={levelInfo}
            isCompleted={levelProgress[currentLevel]?.completed}
            messages={messages}
            isLoading={isLoading}
            onSendMessage={sendMessage}
          />
        ) : (
          /* Welcome Message */
          <Card className="bg-white/95 border border-slate-200 mb-6">
            <CardContent className="pt-6 text-center space-y-2">
              <p className="text-lg text-slate-700">
                Select a level above to begin battling Saruman's layered defences.
              </p>
              <p className="text-sm text-slate-500">
                Tip: You can revisit any conquered level and still submit passwords manually if you found them elsewhere.
              </p>
            </CardContent>
          </Card>
        )}

        <PasswordEntry
          currentLevel={currentLevel}
          onVerify={handleVerifyPassword}
          manualStatus={manualStatus}
          setManualStatus={setManualStatus}
        />

        {passwordFound && (
          <WinCard
            discoveredPassword={discoveredPassword}
            currentLevel={currentLevel}
            onNextLevel={() => handleSelectLevel(currentLevel + 1)}
            onRestart={() => handleSelectLevel(1)}
            onReplay={() => handleSelectLevel(currentLevel)}
          />
        )}
      </div>
    </div>
  );
}

export default App;