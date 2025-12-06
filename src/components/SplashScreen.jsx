import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function SplashScreen({ onComplete }) {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer)
                    setTimeout(onComplete, 500)
                    return 100
                }
                return prev + 2
            })
        }, 30)
        return () => clearInterval(timer)
    }, [onComplete])

    const title = "SARUMAN"
    const subtitle = "THE WHITE WIZARD"

    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
        >
            {/* Multiple animated glow orbs */}
            <motion.div
                className="absolute w-96 h-96 rounded-full bg-primary/15 blur-3xl"
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
                className="absolute w-64 h-64 rounded-full bg-accent/20 blur-2xl"
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            />

            {/* Main content */}
            <div className="relative text-center">
                {/* Decorative line */}
                <motion.div
                    className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                />

                {/* Title with staggered letters */}
                <motion.div className="flex justify-center gap-1 mb-2">
                    {title.split('').map((letter, i) => (
                        <motion.span
                            key={i}
                            className="text-5xl md:text-7xl font-display text-gradient font-bold"
                            initial={{ opacity: 0, y: 40, rotateX: -90 }}
                            animate={{ opacity: 1, y: 0, rotateX: 0 }}
                            transition={{ delay: 0.3 + i * 0.08, duration: 0.5, type: "spring" }}
                        >
                            {letter}
                        </motion.span>
                    ))}
                </motion.div>

                {/* Subtitle */}
                <motion.p
                    className="text-sm md:text-base tracking-[0.3em] text-muted-foreground font-light uppercase"
                    initial={{ opacity: 0, letterSpacing: "0.5em" }}
                    animate={{ opacity: 1, letterSpacing: "0.3em" }}
                    transition={{ delay: 1, duration: 0.6 }}
                >
                    {subtitle}
                </motion.p>

                {/* Tagline */}
                <motion.p
                    className="text-muted-foreground mt-6 text-lg font-light italic"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                >
                    "Against the power of Mordor there can be no victory..."
                </motion.p>

                {/* Decorative line */}
                <motion.div
                    className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-6"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                />
            </div>

            {/* Progress section */}
            <motion.div
                className="mt-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
            >
                <div className="w-64 h-1.5 bg-secondary rounded-full overflow-hidden mb-3">
                    <motion.div
                        className="h-full bg-gradient-to-r from-primary to-accent glow-sm rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-xs text-muted-foreground tracking-wider uppercase">
                    Preparing defenses... {progress}%
                </p>
            </motion.div>
        </motion.div>
    )
}
