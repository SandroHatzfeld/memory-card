import { useState } from "react"
import { cardData } from "./cardData.tsx"
import Card from "./components/Card"

export default function App() {
  const [currentScore, setCurrentScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [reset, setReset] = useState(false)

  const increaseScore = () => {
    const newScore = currentScore + 1
    setCurrentScore(newScore)
    setReset(false)


    if (newScore === cardData.length) {
      roundEnd(true)
    }
  }

  const roundEnd = (isWin = false) => {
    if (isWin) {
      setBestScore(cardData.length)
    } else if (currentScore >= bestScore) {
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
