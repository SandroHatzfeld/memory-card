import { useState } from "react"
import { cardData } from "./cardData.tsx"
import Card from "./components/Card"

export default function App() {
  const [currentScore, setCurrentScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [reset, setReset] = useState(false)

  const increaseScore = () => {
    setCurrentScore(() => currentScore + 1)
    setReset(false)
  }

  const roundEnd = () => {
    if (currentScore > bestScore) {
      setBestScore(currentScore)
    }

    setCurrentScore(0)
    setReset(true)
  }

  return (
    <>
      <header>
        <h1>Memory Game</h1>
        <div>
        <p>{"Score: " + currentScore}</p>
        <p>{"Best score: " + bestScore}</p>
        </div>
      </header>

      <div id="memory-wrapper">
        {cardData.map((card: { name: string; image: string }) => {
          return (
            <Card
              key={card.name}
              resetRound={reset}
              roundEnd={roundEnd}
              increaseScore={increaseScore}
              cardName={card.name}
              cardImage={card.image}
            />
          )
        })}
      </div>

    </>
  )
}
