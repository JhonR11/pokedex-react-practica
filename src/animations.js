// Variantes compartidas de framer-motion
export const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
}

export const item = {
  hidden: { opacity: 0, y: 28, scale: 0.94 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 22 } },
}
