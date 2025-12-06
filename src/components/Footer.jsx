import { motion } from 'framer-motion'

export function Footer() {
  return (
    <motion.footer
      className="text-center py-6 text-sm text-muted-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <p>
        Made by <span className="text-foreground">Carlos Budiman</span> & <span className="text-foreground">Samuel Cedric</span>
      </p>
    </motion.footer>
  )
}
