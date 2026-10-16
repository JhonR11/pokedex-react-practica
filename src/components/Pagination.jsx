import { motion } from "framer-motion"

export default function Pagination({ page, pages, onChange }) {
  const nums = [...new Set([1, pages, page - 2, page - 1, page, page + 1, page + 2])]
    .filter((n) => n >= 1 && n <= pages)
    .sort((a, b) => a - b)

  return (
    <motion.nav className="pg" aria-label="Paginación" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <motion.button whileTap={{ scale: 0.9 }} disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Anterior">‹</motion.button>
      {nums.map((n, i) => (
        <span key={n} className="pg-item">
          {i > 0 && n - nums[i - 1] > 1 && <span className="dots">…</span>}
          <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }} aria-current={n === page ? "page" : undefined} onClick={() => onChange(n)}>{n}</motion.button>
        </span>
      ))}
      <motion.button whileTap={{ scale: 0.9 }} disabled={page === pages} onClick={() => onChange(page + 1)} aria-label="Siguiente">›</motion.button>
    </motion.nav>
  )
}
