import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card'
import { KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react'

export function PasswordEntry({ currentLevel, onVerify, manualStatus, setManualStatus }) {
    const [password, setPassword] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (password.trim()) {
            onVerify(password)
            setPassword('')
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <KeyRound className="w-5 h-5 text-primary" />
                        Manual Entry
                    </CardTitle>
                    <CardDescription>
                        Found the password through other means? Enter it here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex gap-3">
                        <input
                            type="text"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={currentLevel ? "Enter password..." : "Select a level first"}
                            disabled={!currentLevel}
                            className="flex-1 h-10 px-3 rounded-lg border border-border bg-input text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                        />
                        <Button type="submit" disabled={!currentLevel || !password.trim()}>
                            Verify
                        </Button>
                    </form>

                    <AnimatePresence mode="wait">
                        {manualStatus && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`mt-3 p-3 rounded-lg flex items-center gap-2 text-sm ${manualStatus.type === 'success'
                                        ? 'bg-success/20 text-success'
                                        : 'bg-destructive/20 text-destructive'
                                    }`}
                            >
                                {manualStatus.type === 'success' ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                    <AlertCircle className="w-4 h-4" />
                                )}
                                {manualStatus.message}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </motion.div>
    )
}
