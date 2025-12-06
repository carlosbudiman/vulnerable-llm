import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card'
import { CheckCircle2, Lock } from 'lucide-react'
import { staggerContainer, staggerItem } from '@/lib/animations'

export function LevelSelector({
    currentLevel,
    highestUnlockedLevel,
    levelProgress,
    onSelectLevel,
    onError
}) {
    const handleSelect = (level) => {
        const result = onSelectLevel(level)
        if (result?.error && onError) onError(result.error)
    }

    const completedCount = Object.values(levelProgress).filter(l => l?.completed).length

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
        >
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Choose Your Challenge</CardTitle>
                    <CardDescription>Each level strengthens Saruman's defenses</CardDescription>
                </CardHeader>
                <CardContent>
                    <motion.div
                        className="flex flex-wrap gap-3"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        {[1, 2, 3, 4, 5].map((level) => {
                            const isCompleted = !!levelProgress[level]?.completed
                            const isCurrent = currentLevel === level
                            const isLocked = level > highestUnlockedLevel

                            return (
                                <motion.div key={level} variants={staggerItem}>
                                    <Button
                                        variant={isCompleted ? "default" : "outline"}
                                        size="lg"
                                        onClick={() => handleSelect(level)}
                                        disabled={isLocked}
                                        className={`
                      min-w-[120px] gap-2 transition-all
                      ${isCompleted ? "bg-success/20 text-success border-success/30 hover:bg-success/30" : ""}
                      ${isCurrent && !isLocked ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}
                      ${isLocked ? "opacity-50" : ""}
                    `}
                                    >
                                        {isLocked ? <Lock className="w-4 h-4" /> : null}
                                        Level {level}
                                        {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                                    </Button>
                                </motion.div>
                            )
                        })}
                    </motion.div>

                    <div className="mt-6 flex flex-wrap justify-between items-center text-sm text-muted-foreground gap-2">
                        <span>
                            Progress: <strong className="text-foreground">{completedCount}/5</strong> conquered
                        </span>
                        <span>
                            Highest unlocked: <strong className="text-foreground">Level {highestUnlockedLevel}</strong>
                        </span>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
