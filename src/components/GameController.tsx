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

  // const deckPosition = {x: 0, y: 500}

  // initialize with random order
  useEffect(() => {
    if (!props.selectedDifficulty) return
    setSelectedCards(randomizeCards(cardData).slice(0, props.selectedDifficulty.cardCount))
  }, [props.selectedDifficulty])

	// update clicked state and shuffle cards
  const handleScoreIncrease = (cardIndex: number) => {
		props.increaseScore()
		selectedCards[cardIndex].clicked = true
		setSelectedCards(randomizeCards(selectedCards))
		
	}
	
	
  const cardElements = selectedCards.map((card, index) => {
    return (
      <Card
        key={card.name}
				index={index}
        increaseScore={handleScoreIncrease}
        roundEnd={props.roundEnd}
        resetRound={props.reset}
        cardName={card.name}
        cardImage={card.image}
      />
    )
  })

  return <div id="memory-wrapper">{cardElements}</div>
}


// // uniform gsap settings for cards
// if (cardWrapper.current) {
//   gsap.set(cardWrapper.current, {
//     perspective: 1000,
//     ease: "Power3.easeOut",
//     duration: 0.5,
//   })
// }

// // handle animation of card
// const handleMouseMove = contextSafe(
//   (event: React.MouseEvent<HTMLDivElement>) => {
//     const bounds = event.currentTarget.getBoundingClientRect()

//     const rotationAmount = 20

//     // calculate relative position of cursor to card
//     const xPos = (event.clientX - bounds.x) / bounds.width - 0.5
//     const yPos = (event.clientY - bounds.y) / bounds.height - 0.5

//     gsap.to(cardWrapper.current, {
//       rotationY: xPos * rotationAmount,
//       rotationX: yPos * rotationAmount * -1,
//     })
//   }
// )

// // return card to original rotation after mouse left
// const handleMouseLeave = contextSafe(() => {
//   gsap.to(cardWrapper.current, {
//     rotationX: 0,
//     rotationY: 0,
//   })
// })

// // timeline creating for shuffeling animation
// const tl = gsap.timeline({ paused: true })

// if (cardContainer.current) {
//   const pos = calculatePosition(cardContainer.current)

//   tl.to(
//       cardWrapper.current,
//       {
//         x: window.innerWidth / 2 - pos.left - pos.width / 2,
//         y: window.innerHeight / 2 - pos.top - pos.height / 2,
//         duration: 0.5,
//       },
//       "cardMovingCenter"
//     )
//     .to(
//       cardWrapper.current,
//       {
//         x: 0,
//         y: 0,
//         duration: 0.5,
//       },
//       "cardMovingBack"
//     )
// 		.call(props.toggleShuffle, [true])
// }

// if (props.shuffleCards) {
//   tl.play()
// }

function calculatePosition(element: HTMLDivElement) {
  const rect = element.getBoundingClientRect()

  const scrollTop = window.pageYOffset || 0
  const scrollLeft = window.pageXOffset || 0

  const clientTop = 0
  const clientLeft = 0

  return {
    top: Math.round(rect.top + scrollTop - clientTop),
    left: Math.round(rect.left + scrollLeft - clientLeft),
    height: rect.height,
    width: rect.width,
  }
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