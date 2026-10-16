import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { item } from "../animations"
import { getPokemon } from "../hooks/usePokemon"

const COLORS = {
  normal: "#a8a77a", fire: "#ee8130", water: "#6390f0", electric: "#f7d02c",
  grass: "#7ac74c", ice: "#96d9d6", fighting: "#c22e28", poison: "#a33ea1",
  ground: "#e2bf65", flying: "#a98ff3", psychic: "#f95587", bug: "#a6b91a",
  rock: "#b6a136", ghost: "#735797", dragon: "#6f35fc", dark: "#705746",
  steel: "#b7b7ce", fairy: "#d685ad",
}

export default function PokemonCard({ name }) {
  const [data, setData] = useState(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let alive = true
    setData(null)
    getPokemon(name).then((d) => alive && setData(d)).catch(() => alive && setFailed(true))
    return () => { alive = false }
  }, [name])

  if (failed) return <motion.article variants={item} className="card"><h3>{name}</h3><p className="meta">No disponible</p></motion.article>
  if (!data) return <div className="sk" aria-hidden="true" />

  const types = data.types.map((t) => t.type.name)
  const art = data.sprites.other["official-artwork"].front_default || data.sprites.front_default

  return (
    <motion.article
      className="card"
      variants={item}
      whileHover={{ y: -8, rotate: -1 }}
      whileTap={{ scale: 0.97 }}
      style={{ "--tc": COLORS[types[0]] || "#ccc" }}
    >
      <span className="id">#{String(data.id).padStart(4, "0")}</span>
      <motion.img src={art} alt={data.name} loading="lazy" whileHover={{ scale: 1.15, rotate: 4 }} transition={{ type: "spring", stiffness: 300 }} />
      <h3>{data.name}</h3>
      <div className="types">
        {types.map((t, i) => (
          <motion.span
            key={t}
            className="t"
            style={{ background: COLORS[t] }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.08 }}
          >
            {t}
          </motion.span>
        ))}
      </div>
      <p className="meta">{data.height / 10} m · {data.weight / 10} kg</p>
    </motion.article>
  )
}
