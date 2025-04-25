import { useState, useEffect } from "react"
import Card from "./Card"
import * as types from "./types.ts"
import { cardData } from "../data/cardData.tsx"

export default function GameController(props: {
  roundEnd: () => void
  increaseScore: () => void
  reset: boolean
  selectedDifficulty: types.Difficulty
}) {
  const [selectedCards, setSelectedCards] = useState<types.Card[]>([])
  const [shuffleCards, setShuffleCards] = useState(false)

  // const deckPosition = {x: 0, y: 500}

  // initialize with random order
  useEffect(() => {
    if (!props.selectedDifficulty) return
    setSelectedCards(
      randomizeCards(cardData).slice(0, props.selectedDifficulty.cardCount)
    )
  }, [props.selectedDifficulty])

  // update clicked state and shuffle cards
  const handleScoreIncrease = (cardIndex: number) => {
    props.increaseScore()
    selectedCards[cardIndex].clicked = true
    setSelectedCards(randomizeCards(selectedCards))
    setShuffleCards(true)
  }

  const stopShuffleCards = () => {
    setShuffleCards(false)
  }

  return (
    <div id="memory-wrapper">
      {selectedCards.map((card, index) => {
        return (
          <Card
            key={card.name}
            index={index}
            increaseScore={handleScoreIncrease}
            roundEnd={props.roundEnd}
            resetRound={props.reset}
            cardName={card.name}
            cardImage={card.image}
            shuffleCards={shuffleCards}
            stopShuffleCards={stopShuffleCards}
          />
        )
      })}
    </div>
  )
}

const randomizeCards = (array: Array<types.Card>) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}
