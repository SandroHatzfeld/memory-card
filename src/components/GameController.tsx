import { useState, useEffect } from "react"
import Card from "./Card"
import { cardData } from "../data/cardData"

interface Card {
  name: string
  image: string
  clicked: boolean
}

export default function GameController(props: {
  roundEnd: () => void
  increaseScore: () => void
}) {
  const [selectedCards, setSelectedCards] = useState<Card[]>([])

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
    setSelectedCards(randomizeCards(cardData))
  }, [])

  return (
    <div id="memory-wrapper">
      {selectedCards.map((card: Card) => {
        return (
          <Card
            key={card.name}
            increaseScore={props.increaseScore}
						roundEnd={props.roundEnd}
            cardName={card.name}
            cardImage={card.image}
          />
        )
      })}
    </div>
  )
}
