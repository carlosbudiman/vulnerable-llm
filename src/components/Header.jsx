import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export function Header() {
    return (
        <motion.header
            className="text-center mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Decorative top line */}
            <motion.div
                className="w-16 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto mb-6"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
            />

            <div className="flex items-center justify-center gap-4 mb-3">
                <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                >
                    <Sparkles className="w-7 h-7 text-primary" />
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient tracking-wide">
                    Saruman AI
                </h1>
                <motion.div
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                >
                    <Sparkles className="w-7 h-7 text-primary" />
                </motion.div>
            </div>

            <p className="text-muted-foreground text-base md:text-lg font-light max-w-md mx-auto">
                Extract the password from the White Wizard, if you can.
            </p>

            <motion.p
                className="text-xs text-muted-foreground/60 mt-2 tracking-wider uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                Prompt Injection Practice Lab
            </motion.p>
        </motion.header>
    )
}
