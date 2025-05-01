import { useState } from "react"
import { difficulties } from "./data/difficulties"
import * as types from "./components/types.ts"

import GameController from "./components/GameController.tsx"
import Menu from "./components/Menu.tsx"
import RestartMenu from "./components/RestartMenu.tsx"

export default function App() {
  const [gameState, setGameState] = useState<types.GameState>("menu")
  const [isWin, setIsWin] = useState(false)
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
      setIsWin(true)
      roundEnd()
    }
  }

  // end the round. boolean to reduce two functions into one
  const roundEnd = () => {
    if (isWin) {
      setBestScore(difficulty.cardCount)
    } else if (currentScore > bestScore) {
      setBestScore(currentScore)
    }

    setGameState("restart")
  }

  const changeDifficulty = (count: number) => {
    setDifficulty(difficulties[count])
    setIsDifficultySet(true)
    setGameState('game')
  }

  const handleRestartGame = () => {
    setReset(false)
    setCurrentScore(0)
    setGameState("game")
  }
  const handleBackToMenu = () => {
    setCurrentScore(0)
    setIsDifficultySet(false)
    setGameState("menu")
    setIsWin(false)
  }

  return (
    <div className="wrapper">
      <header>
        <h1>Webdev Memory Game</h1>
        {isDifficultySet && (
          <div>
            <p>{`Score: ${currentScore} / ${difficulty.cardCount}`}</p>
            <p>{"Best score: " + bestScore}</p>
          </div>
        )}
      </header>
      {gameState === "menu" && <Menu setDifficulty={changeDifficulty} />}
      {gameState === "restart" && (
        <RestartMenu
          restartGame={handleRestartGame}
          backToMenu={handleBackToMenu}
          win={isWin}
        />
      )}
      {gameState === "game" && (
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
