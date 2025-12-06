import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Shield, Send, Loader2, MessageCircle } from 'lucide-react'
import { messageVariants, userMessageVariants } from '@/lib/animations'

function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-1.5 py-1">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="w-2 h-2 bg-primary rounded-full"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  )
}

function MarkdownContent({ children }) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        code: ({ children }) => (
          <code className="px-1.5 py-0.5 bg-secondary rounded text-xs font-mono">{children}</code>
        ),
        pre: ({ children }) => (
          <pre className="p-3 bg-secondary rounded-lg overflow-x-auto text-xs my-2">{children}</pre>
        ),
        ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
        li: ({ children }) => <li>{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-primary/50 pl-3 italic text-muted-foreground my-2">
            {children}
          </blockquote>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  )
}

export function ChatInterface({
  currentLevel,
  levelInfo,
  isCompleted,
  messages,
  isLoading,
  onSendMessage
}) {
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue)
      setInputValue('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!currentLevel) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Level {currentLevel}</CardTitle>
                <CardDescription className="text-sm mt-0.5">
                  {levelInfo?.description}
                </CardDescription>
              </div>
            </div>
            {isCompleted && (
              <Badge variant="success" className="text-xs">✓ Conquered</Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="h-[420px] overflow-y-auto mb-4 p-4 bg-secondary/20 rounded-xl border border-border/50 scrollbar-thin">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <MessageCircle className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm">Start a conversation with Saruman...</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    className={`flex mb-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    variants={msg.type === 'user' ? userMessageVariants : messageVariants}
                    initial="hidden"
                    animate="visible"
                    layout
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        msg.type === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-md'
                          : 'bg-card border border-border/50 rounded-bl-md'
                      }`}
                    >
                      <div className="text-sm leading-relaxed">
                        {msg.isLoading && !msg.text ? (
                          <LoadingDots />
                        ) : msg.isRetrying ? (
                          <span className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {msg.text}
                          </span>
                        ) : msg.type === 'ai' ? (
                          <MarkdownContent>{msg.text}</MarkdownContent>
                        ) : (
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-3 items-end">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Try to extract the password from Saruman..."
              disabled={!currentLevel || isLoading}
              className="flex-1 min-h-[56px] resize-none"
              rows={2}
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || !currentLevel || isLoading}
              size="icon"
              className="h-14 w-14 rounded-xl shrink-0"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send • Shift+Enter for new line
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
