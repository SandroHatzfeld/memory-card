import { difficulties } from "../data/difficulties"

export default function Menu({setDifficulty}: {setDifficulty: (cardCount: number) => void}) {
  return (
    <nav>
      {difficulties.map((difficulty) => {
        return (
          <button key={difficulty.name} onClick={() => setDifficulty(difficulty.cardCount)}>
            {difficulty.name}
          </button>
        )
      })}
    </nav>
  )
}
