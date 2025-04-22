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
		<div onClick={handleClick}>
			<img src={props.cardImage} alt="" />
			<p>{props.cardName}</p>
		</div>
	)
}