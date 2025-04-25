import { useEffect, useRef, useState } from "react"



export default function Card(props: {
  roundEnd: () => void
  increaseScore: (index: number) => void
  resetRound: boolean
  cardImage: string
  cardName: string 
  index: number

}) {
  // clickstate
  const [wasClicked, setWasClicked] = useState(false)

  // ref for card
  const cardWrapper = useRef(null)
  const cardContainer = useRef(null)


  // handle click and update score/round
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
		
    if (wasClicked) {
      props.roundEnd()
    } else {
      setWasClicked(true)
      props.increaseScore(props.index)
    }
  }

  // reset clickstate when round is over
  useEffect(() => {
    if (props.resetRound) setWasClicked(false)
  }, [props.resetRound])



  return (
    <div
      className="card-wrapper"
      onClick={handleClick}

      ref={cardWrapper}
    >
      <div
        className={`card-container`}
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

