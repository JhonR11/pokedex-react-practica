export default function SearchBar({ value, onChange, total }) {
  return (
    <div className="search">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Busca por nombre o número (ej. pikachu, 25)"
        aria-label="Buscar Pokémon"
      />
      <span className="count">{total} resultados</span>
    </div>
  )
}
