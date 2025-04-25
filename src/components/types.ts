export interface Difficulty {
	name: string
	cardCount: number
	displayedCards: number
}

export interface Card {
	name: string
	image: string
	clicked: boolean
}
