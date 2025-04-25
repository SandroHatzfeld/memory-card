import { useState, useEffect } from "react"
import { cardData } from "./data/cardData.tsx"
import GameController from "./components/GameController.tsx"
import Menu from "./components/Menu.tsx"

interface Card {
  name: string
  image: string
  clicked: boolean
}

export default function App() {
  const [currentScore, setCurrentScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [reset, setReset] = useState(false)
  const [cardCount, setCardCount] = useState(0)
  const [selectedCards, setSelectedCards] = useState<Card[]>([])

  // increase score and test if all cards are correctly clicked
  const increaseScore = () => {
    const newScore = currentScore + 1
    setCurrentScore(newScore)
    setReset(false)

    if (newScore === selectedCards.length) {
      roundEnd(true)
    }
  }

  // end the round. boolean to reduce two functions into one
  const roundEnd = (isWin = false) => {
    if (isWin) {
      setBestScore(selectedCards.length)
      setDifficulty(0)
      setBestScore(0)
    } else if (currentScore > bestScore) {
      setBestScore(currentScore)
    }
    
    setCurrentScore(0)
    setReset(true)
  }

  const setDifficulty = (count: number) => {
    setCardCount(count)
  }

  // initialize with random order
  useEffect(() => {
    setSelectedCards(randomizeCards(cardData).slice(0, cardCount))
  }, [cardCount])

  return (
    <div className="wrapper">
      <header>
        <h1>Memory Game</h1>
        <div>
          <p>{`Score: ${currentScore} / ${selectedCards.length}`}</p>
          <p>{"Best score: " + bestScore}</p>
        </div>
      </header>
      {cardCount === 0 && <Menu setDifficulty={setDifficulty} />}

      <GameController
        increaseScore={increaseScore}
        roundEnd={roundEnd}
        cardCount={cardCount}
        selectedCards={selectedCards}
        reset={reset}
      />
    </div>
  )
}

const randomizeCards = (array: Array<Card>) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}
