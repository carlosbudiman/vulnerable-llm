import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Shield, Send } from 'lucide-react';

// New LoadingDots component
const LoadingDots = () => {
  return (
    <span className="inline-flex items-center">
      <span className="animate-pulse">.</span>
      <span className="animate-pulse delay-75">.</span>
      <span className="animate-pulse delay-150">.</span>
    </span>
  );
};

export function ChatInterface({
  currentLevel,
  levelInfo,
  isCompleted,
  messages,
  isLoading,
  onSendMessage
}) {
  const [inputValue, setInputValue] = useState('');
  const [imageError, setImageError] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Reset image error when level changes
  useEffect(() => {
    setImageError(false);
  }, [currentLevel]);

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getPictureSrc = () => {
    if (!currentLevel) return null;
    const pictureNum = currentLevel >= 4 ? 3 : currentLevel;
    return `/pictures/picture${pictureNum}.jpg`;
  };

  const pictureSrc = getPictureSrc();

  if (!currentLevel) return null;

  return (
    <Card className="mb-6 bg-white/95 border border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-500" />
              Level {currentLevel}
            </CardTitle>
            <CardDescription className="mt-1 text-slate-600">
              {levelInfo?.description}
            </CardDescription>
          </div>
          {isCompleted && (
            <Badge variant="outline" className="bg-green-50 border-green-500 text-green-700">
              Conquered
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Level image */}
        <div className="mb-4">
          <div className="relative rounded-xl border border-slate-200 bg-slate-50 h-64 flex items-center justify-center p-2">
            {pictureSrc && !imageError ? (
              <img
                src={pictureSrc}
                alt={`Level ${currentLevel} illustration`}
                className="max-h-full max-w-full object-contain rounded-lg"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-center text-slate-400 text-sm">
                Add an image at <code className="text-purple-600">public/pictures/picture{currentLevel >= 4 ? 3 : currentLevel}.jpg</code> to theme this level.
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="h-[360px] overflow-y-auto mb-4 space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.type === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-slate-900 border border-slate-200'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">
                  {msg.isRetrying ? (
                    `Retrying... ${msg.text}`
                  ) : msg.isLoading && !msg.text ? (
                    <LoadingDots />
                  ) : (
                    msg.text
                  )}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex gap-2 items-start">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Whisper your scheme to Saruman... (Enter to send, Shift+Enter for new line)"
            disabled={!currentLevel || isLoading}
            className="flex-1 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || !currentLevel || isLoading}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
