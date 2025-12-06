import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Trophy, ArrowRight, RotateCcw, Sparkles } from 'lucide-react'

export function WinCard({ discoveredPassword, currentLevel, onNextLevel, onRestart, onReplay }) {
    const isLastLevel = currentLevel === 5

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <Card className="mb-6 border-success/30 glow relative overflow-hidden">
                {/* Animated background sparkles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute"
                            style={{
                                left: `${15 + i * 15}%`,
                                top: `${20 + (i % 3) * 25}%`,
                            }}
                            animate={{
                                opacity: [0, 1, 0],
                                scale: [0.5, 1, 0.5],
                                y: [0, -10, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.3,
                            }}
                        >
                            <Sparkles className="w-4 h-4 text-success/40" />
                        </motion.div>
                    ))}
                </div>

                <CardHeader className="text-center relative">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="mx-auto mb-4"
                    >
                        <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center border border-success/30">
                            <Trophy className="w-10 h-10 text-success" />
                        </div>
                    </motion.div>
                    <CardTitle className="text-2xl md:text-3xl text-success font-display">
                        {isLastLevel ? "Ultimate Victory!" : "Level Conquered!"}
                    </CardTitle>
                    {isLastLevel && (
                        <motion.p
                            className="text-muted-foreground mt-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            You have defeated Saruman's defenses completely!
                        </motion.p>
                    )}
                </CardHeader>

                <CardContent className="text-center space-y-6 relative">
                    <div>
                        <p className="text-sm text-muted-foreground mb-2">
                            You extracted the password:
                        </p>
                        <motion.div
                            className="inline-block px-8 py-4 bg-secondary/50 rounded-xl border border-success/20"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                        >
                            <span className="font-mono text-2xl text-success tracking-wider">
                                {discoveredPassword}
                            </span>
                        </motion.div>
                    </div>

                    <motion.div
                        className="flex flex-wrap justify-center gap-3 pt-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        {!isLastLevel && (
                            <Button onClick={onNextLevel} size="lg" className="gap-2">
                                Next Level <ArrowRight className="w-4 h-4" />
                            </Button>
                        )}
                        <Button variant="outline" onClick={onReplay} className="gap-2">
                            <RotateCcw className="w-4 h-4" /> Replay
                        </Button>
                        {currentLevel > 1 && (
                            <Button variant="ghost" onClick={onRestart}>
                                Start Over
                            </Button>
                        )}
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
