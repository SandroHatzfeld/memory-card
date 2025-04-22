import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP)

export default function Card(props: {
  roundEnd: () => void
  increaseScore: () => void
  resetRound: boolean
  cardImage: string
  cardName: string
}) {
  // clickstate
  const [wasClicked, setWasClicked] = useState(false)

  // ref for card
  const card = useRef(null)

  // context for gsap cleanup
  const { contextSafe } = useGSAP({ scope: card })

  // handle click and update score/round
  const handleClick = () => {
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

  // handle animation of card
  const handleMouseMove = contextSafe((event: React.MouseEvent<HTMLDivElement>)  => {
    const xPos = (event.clientX / window.innerWidth) - 0.5
    const yPos = (event.clientY / window.innerHeight) - 0.5

    gsap.to(card, {
			duration: 1,
			rotationY: xPos * 100,
			rotationX: yPos * 100,
			ease: "Power1.easeOut"
		})
  })

  return (
    <div
      className="card-wrapper"
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      ref={card}
    >
      <img src={`./images/${props.cardImage}.jpg`} alt="" />
      <p>{props.cardName}</p>
    </div>
  )
}
