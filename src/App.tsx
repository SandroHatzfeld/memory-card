import { useState, useEffect } from "react"
import { cardData } from "./cardData.tsx"
import Card from "./components/Card"

interface Card {
  name: string
  image: string
  clicked: boolean
}

export default function App() {
  const [currentScore, setCurrentScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [reset, setReset] = useState(false)
  const [shuffleCards, setShuffleCards] = useState(false)
  const [cardOrder, setCardOrder] = useState<Card[]>([])
  const [cardCount, setCardCount] = useState(5)

  const randomizeCards = (array: Array<Card>) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }

    return array
  }

  // initialize with random order
  useEffect(() => {
    setCardOrder(randomizeCards(cardData))
  }, [])

  // increase score and test if all cards are correctly clicked
  const increaseScore = () => {
    const newScore = currentScore + 1
    setCurrentScore(newScore)
    setReset(false)

    // change order
    setCardOrder(randomizeCards(cardData))

    if (newScore === cardData.length) {
      roundEnd(true)
    }
  }

  // end the round. boolean to reduce two functions into one
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
        {cardOrder.map((card: Card, index) => {
          if (index < cardCount)
            return (
              <Card
                key={card.name}
                resetRound={reset}
                roundEnd={roundEnd}
                increaseScore={increaseScore}
                shuffleCards={shuffleCards}
                cardName={card.name}
                cardImage={card.image}
              />
            )
        })}
      </div>
    </>
  )
}
