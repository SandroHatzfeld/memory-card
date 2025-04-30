export interface Difficulty {
  name: string
  cardCount: number
}

export interface Card {
  name: string
  image: string
}

export type GameState = 'menu' | 'game' | 'restart'