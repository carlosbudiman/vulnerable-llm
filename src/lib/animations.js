export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } }
}

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

export const fadeInDown = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
}

export const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
}

export const messageVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export const userMessageVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export const buttonHover = {
  scale: 1.02,
  transition: { type: "spring", stiffness: 400, damping: 10 }
}

export const buttonTap = {
  scale: 0.98
}

export const glowPulse = {
  boxShadow: [
    "0 0 20px rgba(139, 92, 246, 0.3)",
    "0 0 40px rgba(139, 92, 246, 0.5)",
    "0 0 20px rgba(139, 92, 246, 0.3)"
  ],
  transition: { duration: 2, repeat: Infinity }
}
