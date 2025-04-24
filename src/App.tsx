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
  const [isHidden, setIsHidden] = useState(true)
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
    setTimeout(() => {
      setHideCard(false)
    }, 500)
  }, [])

  // increase score and test if all cards are correctly clicked
  const increaseScore = () => {
    const newScore = currentScore + 1
    setCurrentScore(newScore)
    setReset(false)

    setHideCard(true)
    toggleShuffle()

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

  const toggleShuffle = (randomize = false) => {
    setShuffleCards(!shuffleCards)

    if (randomize) {
      // change order
      setCardOrder(randomizeCards(cardData))
      setTimeout(() => {
        setHideCard(false)
      }, 10)
    }
  }

  const setHideCard = (state = false) => {
    setIsHidden(state)
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

      <div id="memory-wrapper" onClick={() => toggleShuffle(false)}>
        {cardOrder.map((card: Card, index) => {
          if (index < cardCount)
            return (
              <Card
                key={card.name}
                resetRound={reset}
                roundEnd={roundEnd}
                increaseScore={increaseScore}
                shuffleCards={shuffleCards}
                toggleShuffle={toggleShuffle}
                setHideCard={setHideCard}
                isHidden={isHidden}
                cardName={card.name}
                cardImage={card.image}
              />
            )
        })}
      </div>
    </>
  )
}
