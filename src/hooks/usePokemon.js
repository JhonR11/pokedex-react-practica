import { useEffect, useState } from "react"

const BASE = "https://pokeapi.co/api/v2/pokemon"
const cache = new Map()

/** GET /pokemon/{id or name}/ con caché en memoria. */
export async function getPokemon(idOrName) {
  const key = String(idOrName).toLowerCase()
  if (cache.has(key)) return cache.get(key)
  const res = await fetch(`${BASE}/${key}/`)
  if (!res.ok) throw new Error(`Pokémon "${key}" no encontrado`)
  const data = await res.json()
  cache.set(key, data)
  return data
}

/** GET /pokemon?limit=100000&offset=0 → lista liviana { id, name }. */
export function usePokemonList() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const ctrl = new AbortController()
    fetch(`${BASE}?limit=100000&offset=0`, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Error al consultar la PokéAPI")
        return r.json()
      })
      .then((j) =>
        setList(
          j.results.map((p) => ({
            name: p.name,
            id: Number(p.url.split("/").filter(Boolean).pop()),
          }))
        )
      )
      .catch((e) => e.name !== "AbortError" && setError(e.message))
      .finally(() => setLoading(false))
    return () => ctrl.abort()
  }, [])

  return { list, loading, error }
}
