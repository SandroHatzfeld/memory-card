import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP)

export default function Card(props: {
  roundEnd: () => void
  increaseScore: () => void
  toggleShuffle: () => void
  resetRound: boolean
  cardImage: string
  cardName: string
  shuffleCards: boolean
}) {
  // clickstate
  const [wasClicked, setWasClicked] = useState(false)

  // ref for card
  const card = useRef(null)

  // context for gsap cleanup
  const { contextSafe } = useGSAP({ scope: card })

  // handle click and update score/round
  const handleClick = () => {
    if (props.shuffleCards) return
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
  if (card.current) {
    gsap.set(card.current, {
      perspective: 100,
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

      gsap.to(card.current, {
        rotationY: xPos * rotationAmount,
        rotationX: yPos * rotationAmount * -1,
      })
    }
  )

  // return card to original rotation after mouse left
  const handleMouseLeave = contextSafe(() => {
    if (props.shuffleCards) return

    gsap.to(card.current, {
      rotationX: 0,
      rotationY: 0,
    })
  })

  const tl = gsap.timeline({ paused: true })
  tl.to(
      card.current,
      {
        rotationY: 180,
        duration: 1,
      },
      "cardTurning"
    )
    .to(
      card.current,
      {
        position: "absolute",
        xPercent: -50,
        yPercent: -50,
        left: window.innerWidth / 2,
        top: window.innerHeight / 2,
				duration:1
      },
      "cardMoving"
    )

  if (props.shuffleCards) {
    tl.play()
    // tl.pause()
  }

  return (
    <div
      className="card-wrapper"
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={card}
    >
      <img src={props.cardImage} alt="" />
      <p>{props.cardName}</p>
    </div>
  )
}
