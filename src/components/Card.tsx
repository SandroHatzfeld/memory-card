import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP)

export default function Card(props: {
  roundEnd: () => void
  increaseScore: () => void
  toggleShuffle: () => void
  setHideCard: () => void
  resetRound: boolean
  cardImage: string
  cardName: string
  shuffleCards: boolean
  isHidden: boolean
}) {
  // clickstate
  const [wasClicked, setWasClicked] = useState(false)

  // ref for card
  const cardWrapper = useRef(null)
  const cardContainer = useRef(null)

  // context for gsap cleanup
  const { contextSafe } = useGSAP({ scope: cardWrapper })

  // handle click and update score/round
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (props.shuffleCards || props.isHidden) return
		
    if (wasClicked) {
      props.roundEnd()
    } else {
      setWasClicked(true)
      props.increaseScore()
    }
  }

  // reset clickstate when round is over
  useEffect(() => {
    if (props.resetRound) setWasClicked(false)
  }, [props.resetRound])

  // uniform gsap settings for cards
  if (cardWrapper.current) {
    gsap.set(cardWrapper.current, {
      perspective: 1000,
      ease: "Power3.easeOut",
      duration: 0.5,
    })
  }

  // handle animation of card
  const handleMouseMove = contextSafe(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (props.shuffleCards) return
      const bounds = event.currentTarget.getBoundingClientRect()

      const rotationAmount = 20

      // calculate relative position of cursor to card
      const xPos = (event.clientX - bounds.x) / bounds.width - 0.5
      const yPos = (event.clientY - bounds.y) / bounds.height - 0.5

      gsap.to(cardWrapper.current, {
        rotationY: xPos * rotationAmount,
        rotationX: yPos * rotationAmount * -1,
      })
    }
  )

  // return card to original rotation after mouse left
  const handleMouseLeave = contextSafe(() => {
    if (props.shuffleCards) return

    gsap.to(cardWrapper.current, {
      rotationX: 0,
      rotationY: 0,
    })
  })

  // timeline creating for shuffeling animation
  const tl = gsap.timeline({ paused: true })

  if (cardContainer.current) {
    const pos = calculatePosition(cardContainer.current)

    tl.to(
        cardWrapper.current,
        {
          x: window.innerWidth / 2 - pos.left - pos.width / 2,
          y: window.innerHeight / 2 - pos.top - pos.height / 2,
          duration: 0.5,
        },
        "cardMovingCenter"
      )
      .to(
        cardWrapper.current,
        {
          x: 0,
          y: 0,
          duration: 0.5,
        },
        "cardMovingBack"
      )
			.call(props.toggleShuffle, [true])
  }

  if (props.shuffleCards) {
    tl.play()
  }

  return (
    <div
      className="card-wrapper"
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={cardWrapper}
    >
      <div
        className={`card-container ${props.isHidden && "hidden"}`}
        ref={cardContainer}
      >
        <div className="card-front">
          <img src={props.cardImage} alt="" />
          <p>{props.cardName}</p>
        </div>
        <div className="card-back"></div>
      </div>
    </div>
  )
}

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
