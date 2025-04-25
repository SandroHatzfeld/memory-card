import { useState } from "react"
import { difficulties } from "./data/difficulties"
import * as types from "./components/types.ts"

import GameController from "./components/GameController.tsx"
import Menu from "./components/Menu.tsx"

export default function App() {
  const [currentScore, setCurrentScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [reset, setReset] = useState(false)
  const [difficulty, setDifficulty] = useState<types.Difficulty>(
    difficulties[0]
  )
  const [isDifficultySet, setIsDifficultySet] = useState(false)

  // increase score and test if all cards are correctly clicked
  const increaseScore = () => {
    const newScore = currentScore + 1
    setCurrentScore(newScore)
    setReset(false)

    if (newScore === difficulty.cardCount) {
      roundEnd(true)
    }
  }

  // end the round. boolean to reduce two functions into one
  const roundEnd = (isWin = false) => {
    if (isWin) {
      setBestScore(difficulty.cardCount)

      // implement win screen
      setIsDifficultySet(false)
      setBestScore(0)
    } else if (currentScore > bestScore) {

      // implement replay screen
      setBestScore(currentScore)
    }

    setCurrentScore(0)
    setReset(true)
  }

  const changeDifficulty = (count: number) => {
    setDifficulty(difficulties[count])
    setIsDifficultySet(true)
  }

  return (
    <div className="wrapper">
      <header>
        <h1>Memory Game</h1>
        {isDifficultySet && (
          <div>
            <p>{`Score: ${currentScore} / ${difficulty.cardCount}`}</p>
            <p>{"Best score: " + bestScore}</p>
          </div>
        )}
      </header>
      {isDifficultySet === false && <Menu setDifficulty={changeDifficulty} />}
      {isDifficultySet && (
        <GameController
          increaseScore={increaseScore}
          roundEnd={roundEnd}
          selectedDifficulty={difficulty}
          reset={reset}
        />
      )}
    </div>
  )
}
