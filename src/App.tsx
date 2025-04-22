import { useState } from "react"
import { cardData } from "./cardData.tsx"
import Card from "./components/Card"

export default function App() {
  const [currentScore, setCurrentScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [reset, setReset] = useState(false)

  const increaseScore = () => {
    setCurrentScore(currentScore + 1)
    
    if (currentScore === cardData.length - 1) {
      roundWin()
    }
  }

  const roundEnd = () => {
    if (currentScore > bestScore) {
      setBestScore(currentScore)
    }

    setCurrentScore(0)
    setReset(true)
  }

  const roundWin = () => {
    
    

    roundEnd()
    
  }
  return (
    <>
      <h1>Memory Game</h1>
      <p>{"Score: " + currentScore}</p>
      <p>{"Best score: " + bestScore}</p>
      <div id="memory-wrapper">
        {cardData.map((card: { name: string; image: string }) => {
          return (
            <Card
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
