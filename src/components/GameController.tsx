import { useState, useEffect, useRef } from "react"
import Card from "./Card"
import * as types from "./types.ts"
import { cardData } from "../data/cardData.tsx"

import gsap from "gsap"
import { useGSAP } from "@gsap/react"
gsap.registerPlugin(useGSAP)

const cardSize = { width: 300, height: 500 }
const deckPosition = {
  x: window.innerWidth / 2 -  cardSize.width / 2,
  y: window.innerHeight / 2 - cardSize.height / 2,
}
const columns = 5

export default function GameController(props: {
  roundEnd: () => void
  increaseScore: () => void
  reset: boolean
  selectedDifficulty: types.Difficulty
}) {
  const [selectedCards, setSelectedCards] = useState<types.Card[]>([])
  const [shuffleCards, setShuffleCards] = useState(false)
  const [originalDeckPositions, setOriginalDeckPositions] = useState<
    { x: number; y: number }[]
  >([])
  const [originalCardPositions, setOriginalCardPositions] = useState<
    { x: number; y: number }[]
  >([])
  const [currentCardPositions, setCurrentCardPositions] = useState<
    { x: number; y: number }[]
  >([])
  const shuffleTimelineRef = useRef<GSAPTimeline | null>(null)

  // Modify the timeline useEffect
  useEffect(() => {
    const startTimeline = gsap.timeline()
    startTimeline
      .to({}, { duration: 0.5 })
      .call(() => {
        setCurrentCardPositions(originalCardPositions)
      })
      .to({}, { duration: 0.5 })
      .call(() => setShuffleCards(false))

    // Store timeline in ref
    shuffleTimelineRef.current = gsap.timeline({ 
      paused: true,
    })

    shuffleTimelineRef.current
      .call(() => setShuffleCards(true))
      .to({}, { duration: 0.5 })
      // Move to deck
      .call(() => setCurrentCardPositions(originalDeckPositions))
      .to({}, { duration: 0.5 })
      // Move to random positions
      .call(() => {
        const randomPositions = randomizeCardPositions([...originalCardPositions])
        setCurrentCardPositions(randomPositions)
      })
      .to({}, { duration: 0.5 })
      .call(() => setShuffleCards(false))

    return () => {
      startTimeline.kill()
      shuffleTimelineRef.current?.kill()
    }
  }, [originalCardPositions, originalDeckPositions, selectedCards])

  // initialize with random order
  useEffect(() => {
    if (!props.selectedDifficulty) return
    // select random cards from the available data
    const randomCards = randomizeCards(cardData).slice(
      0,
      props.selectedDifficulty.cardCount
    )

    setSelectedCards(randomCards)
    setOriginalCardPositions(updateCardPosition(randomCards))
    setOriginalDeckPositions(randomCards.map(() => deckPosition))
    setCurrentCardPositions(updateCardPosition(randomCards))
  }, [props.selectedDifficulty])

  // update clicked state and shuffle cards
  const handleScoreIncrease = () => {
    props.increaseScore()
    shuffleTimelineRef.current?.restart()
    
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
            position={currentCardPositions[index]}
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

const updateCardPosition = (cards: Array<types.Card>) => {
  let cardPositions: Array<{ x: number; y: number }> = []

  cards.forEach((cardData, index) => {
    const row = Math.floor(index / columns)
    cardPositions.push({
      x: (index % columns) * cardSize.width,
      y: row * cardSize.height,
    })
  })

  return cardPositions
}

const randomizeCardPositions = (positions: Array<{ x: number; y: number }>) => {
  const newPositions = [...positions]
  for (let i = newPositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = newPositions[i]
    newPositions[i] = newPositions[j]
    newPositions[j] = temp
  }
  return newPositions
}
