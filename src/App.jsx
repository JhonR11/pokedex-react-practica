import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { container } from "./animations"
import { usePokemonList } from "./hooks/usePokemon"
import PokeballHero from "./components/PokeballHero"
import SearchBar from "./components/SearchBar"
import PokemonCard from "./components/PokemonCard"
import Pagination from "./components/Pagination"

const PER_PAGE = 24

export default function App() {
  const { list, loading, error } = usePokemonList()
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return list
    return list.filter((p) => p.name.includes(q) || String(p.id) === q)
  }, [list, query])

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const items = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  useEffect(() => setPage(1), [query])
  // al cambiar de página o buscar, lleva la vista a la Pokédex (no en la carga inicial)
  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return }
    document.getElementById("pokedex")?.scrollIntoView({ behavior: "smooth" })
  }, [page, query])

  return (
    <>
      <motion.header
        className="top"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      >
        <motion.h1 className="px" whileHover={{ scale: 1.05 }}>Poké<b>Hub</b></motion.h1>
        <SearchBar value={query} onChange={setQuery} total={filtered.length} />
      </motion.header>

      <PokeballHero />

      <main className="wrap" id="pokedex">
        <h2 className="px dex-title">Pokédex</h2>
        {error && <p className="msg">{error}. Recarga la página.</p>}
        {loading && <div className="grid">{Array.from({ length: 8 }, (_, i) => <div key={i} className="sk" />)}</div>}
        {!loading && !error && items.length === 0 && <p className="msg">Ningún Pokémon coincide con tu búsqueda.</p>}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${query}-${page}`}
            className="grid"
            variants={container}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
          >
            {items.map((p) => <PokemonCard key={p.name} name={p.name} />)}
          </motion.div>
        </AnimatePresence>
        {!loading && items.length > 0 && <Pagination page={page} pages={pages} onChange={setPage} />}
      </main>

      <footer>Datos de PokéAPI · Pokémon pertenece a Nintendo / Game Freak. Proyecto de fans.</footer>
    </>
  )
}
