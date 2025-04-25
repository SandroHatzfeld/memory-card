import { useState, useEffect } from "react"
import { cardData } from "./data/cardData.tsx"
import GameController from "./components/GameController.tsx"
import Menu from "./components/Menu.tsx"

export default function App() {
  const [currentScore, setCurrentScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [reset, setReset] = useState(false)
  const [cardCount, setCardCount] = useState(0)

  // increase score and test if all cards are correctly clicked
  const increaseScore = () => {
    const newScore = currentScore + 1
    setCurrentScore(newScore)
    setReset(false)

    if (newScore === cardData.length) {
      roundEnd(true)
    }
  }

  // end the round. boolean to reduce two functions into one
  const roundEnd = (isWin = false) => {
    if (isWin) {
      setBestScore(cardData.length)
    } else if (currentScore > bestScore) {
      setBestScore(currentScore)
    }

    setCurrentScore(0)
    setReset(true)
  }

  const setDifficulty = (count: number) => {
    setCardCount(count)
  }

  return (
    <div className="wrapper">
      <header>
        <h1>Memory Game</h1>
        <div>
          <p>{"Score: " + currentScore}</p>
          <p>{"Best score: " + bestScore}</p>
        </div>
      </header>
      {cardCount === 0 && <Menu setDifficulty={setDifficulty} />}

      <GameController increaseScore={increaseScore} roundEnd={roundEnd} />
    </div>
  )
}
