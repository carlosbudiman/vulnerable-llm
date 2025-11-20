import { useState, useEffect, useRef } from 'react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Textarea } from './components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Send, Sparkles, Shield, RefreshCcw, CheckCircle2 } from 'lucide-react'

const API_BASE = '/api'

function App() {
  const [currentLevel, setCurrentLevel] = useState(null)
  const [passwordFound, setPasswordFound] = useState(false)
  const [levelInfo, setLevelInfo] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [manualPassword, setManualPassword] = useState('')
  const [manualStatus, setManualStatus] = useState(null)
  const [discoveredPassword, setDiscoveredPassword] = useState(null)
  const [levelProgress, setLevelProgress] = useState({})
  const [imageError, setImageError] = useState(false)
  const [highestUnlockedLevel, setHighestUnlockedLevel] = useState(1)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const selectLevel = async (level) => {
    // Prevent jumping ahead to locked levels, but allow revisiting earlier ones
    if (level > highestUnlockedLevel) {
      setManualStatus({
        type: 'error',
        message: `Level ${level} is locked. Conquer level ${highestUnlockedLevel} first.`
      })
      return
    }

    setCurrentLevel(level)
    setPasswordFound(false)
    setMessages([])
    setInputValue('')
    setManualPassword('')
    setManualStatus(null)
    setDiscoveredPassword(null)
    setImageError(false)

    try {
      const response = await fetch(`${API_BASE}/level/${level}`)
      const data = await response.json()
      setLevelInfo(data)
      setMessages([{
        type: 'ai',
        text: `Welcome to Level ${level}! ${data.description}`
      }])
    } catch (error) {
      console.error('Error loading level:', error)
      setMessages([{
        type: 'ai',
        text: 'Error loading level. Make sure the server is running.'
      }])
    }
  }

  const sendMessage = async () => {
    if (!inputValue.trim() || !currentLevel || isLoading) return

    const userMessage = inputValue.trim()
    setInputValue('')
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: userMessage }])
    setIsLoading(true)

    // Add loading message
    setMessages(prev => [...prev, { type: 'ai', text: 'Thinking...', isLoading: true }])

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level: currentLevel,
          message: userMessage
        })
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()

      // Remove loading message and add AI response
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading)
        return [...filtered, { type: 'ai', text: data.response }]
      })

      if (data.password_found) {
        setPasswordFound(true)
        setDiscoveredPassword(data.password || null)
        setLevelProgress(prev => {
          const updated = {
            ...prev,
            [currentLevel]: { completed: true, method: 'chat' }
          }
          return updated
        })
        setHighestUnlockedLevel(prev => Math.min(5, Math.max(prev, currentLevel + 1)))
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading)
        return [...filtered, { 
          type: 'ai', 
          text: 'Error: Could not connect to server. Make sure the Flask server is running on port 5000.' 
        }]
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const verifyPassword = async () => {
    if (!currentLevel || !manualPassword.trim()) {
      setManualStatus({ type: 'error', message: 'Select a level and enter a password first.' })
      return
    }

    try {
      const response = await fetch(`${API_BASE}/verify-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level: currentLevel, password: manualPassword })
      })

      const data = await response.json()

      if (data.error) {
        setManualStatus({ type: 'error', message: data.error })
        return
      }

      if (data.correct) {
        setPasswordFound(true)
        setDiscoveredPassword(data.password || manualPassword)
        setManualStatus({ type: 'success', message: data.message || 'Password accepted!' })
        setLevelProgress(prev => {
          const updated = {
            ...prev,
            [currentLevel]: { completed: true, method: 'manual' }
          }
          return updated
        })
        setHighestUnlockedLevel(prev => Math.min(5, Math.max(prev, currentLevel + 1)))
      } else {
        setManualStatus({ type: 'error', message: data.message || 'That is not the right incantation.' })
      }
    } catch (error) {
      console.error('Verification error:', error)
      setManualStatus({ type: 'error', message: 'Could not verify password. Is the server running?' })
    }
  }

  const pictureSrc = currentLevel ? `/pictures/picture${currentLevel}.jpg` : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 text-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <Card className="mb-6 border border-purple-200 bg-white/90 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl flex items-center justify-center gap-2">
              <Sparkles className="w-8 h-8 text-purple-500" />
              Saruman AI - Shadow Prompt Lab
            </CardTitle>
            <CardDescription className="text-lg">
              Try to outwit Saruman and steal his secret words across five escalating wards.
            </CardDescription>
            <CardDescription className="text-lg">
              Created by Carlos Budiman
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Level Selector */}
        <Card className="mb-6 bg-white/90 border border-slate-200">
          <CardHeader>
            <CardTitle>Select Level</CardTitle>
            <CardDescription>Choose a level to begin your challenge</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 items-center">
              {[1, 2, 3, 4, 5].map((level) => {
                const isCompleted = !!levelProgress[level]?.completed
                const isCurrent = currentLevel === level
                const isLocked = level > highestUnlockedLevel

                return (
                  <Button
                    key={level}
                    variant={isCompleted ? "default" : "outline"}
                    size="lg"
                    onClick={() => selectLevel(level)}
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
                )
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

        {/* Chat Container */}
        {currentLevel && (
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
                  {levelProgress[currentLevel]?.completed && (
                    <Badge variant="outline" className="bg-green-50 border-green-500 text-green-700">
                      Conquered
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Level image just above chat */}
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
                        Add an image at <code className="text-purple-600">pictures/picture{currentLevel}.jpg</code> to theme this level.
                      </div>
                    )}
                  </div>
                </div>

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
                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

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
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || !currentLevel || isLoading}
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
          </Card>
        )}

        {/* Manual Password Entry */}
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
                  value={manualPassword}
                  onChange={(e) => setManualPassword(e.target.value)}
                  className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                  disabled={!currentLevel}
                />
                <Button onClick={verifyPassword} disabled={!currentLevel}>
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

        {/* Password Reveal */}
        {passwordFound && (
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
                      onClick={() => selectLevel(currentLevel + 1)}
                      className="w-full"
                    >
                      Advance to Level {currentLevel + 1}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => selectLevel(1)}
                      className="w-full"
                    >
                      Restart from Level 1
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => selectLevel(currentLevel)}
                  >
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Replay This Level
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Welcome Message */}
        {!currentLevel && (
          <Card className="bg-white/95 border border-slate-200">
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
      </div>
    </div>
  )
}

export default App

