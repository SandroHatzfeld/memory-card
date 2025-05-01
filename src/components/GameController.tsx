import { useState, useEffect, useRef } from "react"
import Card from "./Card"
import * as types from "./types.ts"
import { cardData } from "../data/cardData.tsx"

import gsap from "gsap"
import { useGSAP } from "@gsap/react"
gsap.registerPlugin(useGSAP)

const cardSize = { width: 250, height: 360 }
const cardGap = 20
const columns = 5
const deckOrigin = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  // x: 0, y: 0,
}
export default function GameController(props: {
  roundEnd: () => void
  increaseScore: () => void
  reset: boolean
  selectedDifficulty: types.Difficulty
}) {
  const [selectedCards, setSelectedCards] = useState<types.Card[]>([])
  const [shuffleCards, setShuffleCards] = useState(false)
  const [originalDeckOrigins, setOriginalDeckOrigins] = useState<
    { x: number; y: number }[]
  >([])
  const [originalCardPositions, setOriginalCardPositions] = useState<
    { x: number; y: number }[]
  >([])
  const [currentCardPositions, setCurrentCardPositions] = useState<
    { x: number; y: number }[]
  >([])
  const shuffleTimelineRef = useRef<GSAPTimeline | null>(null)

  const calculateCardPositions = () => {
    const positions: Array<{ x: number; y: number }> = []
    const rows = Math.ceil(props.selectedDifficulty.cardCount / columns)
    const gridWidth = columns * (cardSize.width + cardGap) - cardGap
    const gridHeight = rows * (cardSize.height + cardGap) - cardGap
    
    const startX = window.innerWidth/2 - gridWidth/2
    const startY = window.innerHeight/2 - gridHeight/2

    for (let index = 0; index < props.selectedDifficulty.cardCount; index++) {
      const row = Math.floor(index / columns)
      const col = index % columns
      
      positions.push({
        x: startX + col * (cardSize.width + cardGap),
        y: startY + row * (cardSize.height + cardGap)
      })
    }
    return positions
  }

  // initialize with random order
  useEffect(() => {
    if (!props.selectedDifficulty) return
    const randomCards = randomizeCards(cardData).slice(
      0,
      props.selectedDifficulty.cardCount
    )

    const positions = calculateCardPositions()
    
    setSelectedCards(randomCards)
    setOriginalDeckOrigins(randomCards.map(() => deckOrigin))
    setOriginalCardPositions(positions)
    setCurrentCardPositions(positions)
  }, [props.selectedDifficulty])

  useEffect(() => {
    const handleResize = () => {
      if (!props.selectedDifficulty) return
      const newPositions = calculateCardPositions()
      setOriginalCardPositions(newPositions)
      setCurrentCardPositions(newPositions)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [props.selectedDifficulty])

  // Modify the timeline useEffect
  useEffect(() => {
    const startTimeline = gsap.timeline()
    startTimeline
      .to({}, { duration: 0.1 })
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
      .call(() => setCurrentCardPositions(originalDeckOrigins))
      .to({}, { duration: 0.5 })
      // Move to random positions
      .call(() => {
        const randomPositions = randomizeCardPositions([
          ...originalCardPositions,
        ])
        setCurrentCardPositions(randomPositions)
      })
      .to({}, { duration: 0.5 })
      .call(() => setShuffleCards(false))

    return () => {
      startTimeline.kill()
      shuffleTimelineRef.current?.kill()
    }
  }, [originalCardPositions, originalDeckOrigins, selectedCards])

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
            cardSize={cardSize}
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
