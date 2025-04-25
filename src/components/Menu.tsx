import { difficulties } from "../data/difficulties"

export default function Menu({
  setDifficulty,
}: {
  setDifficulty: (cardCount: number) => void
}) {
  return (
    <nav>
      <div>
        {difficulties.map((difficulty, index) => {
          return (
            <button key={difficulty.name} onClick={() => setDifficulty(index)}>
              {difficulty.name}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
