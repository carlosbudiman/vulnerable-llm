import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameState } from './hooks/useGameState'
import { SplashScreen } from './components/SplashScreen'
import { Header } from './components/Header'
import { LevelSelector } from './components/LevelSelector'
import { ChatInterface } from './components/ChatInterface'
import { PasswordEntry } from './components/PasswordEntry'
import { WinCard } from './components/WinCard'
import { Footer } from './components/Footer'
import { Card, CardContent } from './components/ui/card'

function App() {
    const [showSplash, setShowSplash] = useState(true)
    const [manualStatus, setManualStatus] = useState(null)

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
    } = useGameState()

    const handleSelectLevel = (level) => {
        const result = selectLevel(level)
        if (result?.error) {
            setManualStatus({ type: 'error', message: result.error })
        } else {
            setManualStatus(null)
        }
    }

    const handleVerifyPassword = async (password) => {
        const result = await verifyPassword(password)
        if (result.success) {
            setManualStatus({ type: 'success', message: result.message })
        } else {
            setManualStatus({ type: 'error', message: result.error })
        }
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background gradient orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
            </div>

            <AnimatePresence mode="wait">
                {showSplash ? (
                    <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
                ) : (
                    <motion.div
                        key="main"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative z-10"
                    >
                        <div className="container mx-auto px-4 py-8 max-w-4xl">
                            <Header />

                            <LevelSelector
                                currentLevel={currentLevel}
                                highestUnlockedLevel={highestUnlockedLevel}
                                levelProgress={levelProgress}
                                onSelectLevel={handleSelectLevel}
                                onError={(msg) => setManualStatus({ type: 'error', message: msg })}
                            />

                            <AnimatePresence mode="wait">
                                {currentLevel ? (
                                    <ChatInterface
                                        key={`chat-${currentLevel}`}
                                        currentLevel={currentLevel}
                                        levelInfo={levelInfo}
                                        isCompleted={levelProgress[currentLevel]?.completed}
                                        messages={messages}
                                        isLoading={isLoading}
                                        onSendMessage={sendMessage}
                                    />
                                ) : (
                                    <motion.div
                                        key="welcome"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >
                                        <Card className="mb-6">
                                            <CardContent className="pt-6 text-center space-y-2">
                                                <p className="text-lg text-foreground">
                                                    Select a level above to begin your challenge.
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Use prompt injection techniques to extract Saruman's secrets.
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <PasswordEntry
                                currentLevel={currentLevel}
                                onVerify={handleVerifyPassword}
                                manualStatus={manualStatus}
                                setManualStatus={setManualStatus}
                            />

                            <AnimatePresence>
                                {passwordFound && (
                                    <WinCard
                                        discoveredPassword={discoveredPassword}
                                        currentLevel={currentLevel}
                                        onNextLevel={() => handleSelectLevel(currentLevel + 1)}
                                        onRestart={() => handleSelectLevel(1)}
                                        onReplay={() => handleSelectLevel(currentLevel)}
                                    />
                                )}
                            </AnimatePresence>

                            <Footer />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default App
