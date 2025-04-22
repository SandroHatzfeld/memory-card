import { useEffect, useState } from "react"

export default function Card(props: { roundEnd: () => void; increaseScore: () => void; resetRound: boolean; cardImage: string; cardName: string}) {
	const [wasClicked, setWasClicked] = useState(false)

	const handleClick = () => {
		if(wasClicked) {
			props.roundEnd()
		} else {
			setWasClicked(true)
			props.increaseScore()
		}
	}

	useEffect(() => {
		if(props.resetRound)
			setWasClicked(false)
		
	}, [props.resetRound])
	

	return (
		<div className="card-wrapper" onClick={handleClick}>
			<img src={`./images/${props.cardImage}.jpg`} alt="" />
			<p>{props.cardName}</p>
		</div>
	)
}