import { useState, useEffect, useRef, useCallback } from "react"
import Card from "./Card"
import * as types from "./types.ts"
import { cardData } from "../data/cardData.tsx"

import gsap from "gsap"
import { useGSAP } from "@gsap/react"
gsap.registerPlugin(useGSAP)

const cardGap = 20
const topPadding = 0

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

  const [cardSize, setCardSize] = useState({ width: 250, height: 360 })
  const shuffleTimelineRef = useRef<GSAPTimeline | null>(null)

  const deckOrigin = useRef({
    x: window.innerWidth / 2 - cardSize.width / 2,
    y: topPadding,
  })

  const calculateCardPositions = useCallback(
    (size: typeof cardSize, cols: number) => {
      const positions: Array<{ x: number; y: number }> = []
      const gridWidth = cols * (size.width + cardGap) - cardGap

      const startX = window.innerWidth / 2 - gridWidth / 2
      const startY = topPadding

      for (let index = 0; index < props.selectedDifficulty.cardCount; index++) {
        const row = Math.floor(index / cols)
        const col = index % cols

        positions.push({
          x: startX + col * (size.width + cardGap),
          y: startY + row * (size.height + cardGap),
        })
      }
      return positions
    },
    [props.selectedDifficulty?.cardCount]
  )

  const resizeCardsAndColumns = useCallback(() => {
    let newSize = { width: 250, height: 360 }
    let newColumns = 5

    if (window.innerWidth < 550) {
      newSize = { width: 100, height: 144 }
      newColumns = 3
    } else if (window.innerWidth < 1350) {
      newSize = { width: 150, height: 216 }
      newColumns = window.innerWidth < 850 ? 3 : 5
    }

    setCardSize(newSize)

    return {
      positions: calculateCardPositions(newSize, newColumns),
      size: newSize,
      columns: newColumns,
    }
  }, [calculateCardPositions])

  // initialize with random order
  useEffect(() => {
    if (!props.selectedDifficulty) return
    const randomCards = randomizeCards(cardData).slice(
      0,
      props.selectedDifficulty.cardCount
    )

    const { positions, size } = resizeCardsAndColumns()
    deckOrigin.current = {
      x: window.innerWidth / 2 - size.width / 2,
      y: topPadding,
    }

    setSelectedCards(randomCards)
    setOriginalDeckOrigins(randomCards.map(() => deckOrigin.current))
    setOriginalCardPositions(positions)
    setCurrentCardPositions(positions)
  }, [props.selectedDifficulty, resizeCardsAndColumns])

  useEffect(() => {
    const handleResize = () => {
      if (!props.selectedDifficulty) return

      const newPositions = resizeCardsAndColumns()

      deckOrigin.current = {
        x: window.innerWidth / 2 - newPositions.size.width / 2,
        y: topPadding,
      }
      
      setOriginalDeckOrigins(selectedCards.map(() => deckOrigin.current))

      setOriginalCardPositions(newPositions.positions)
      setCurrentCardPositions(newPositions.positions)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [props.selectedDifficulty, resizeCardsAndColumns, selectedCards])

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
