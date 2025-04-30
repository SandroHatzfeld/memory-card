export default function RestartMenu(props: {
  restartGame: () => void
  backToMenu: () => void
  win: boolean
}) {
  return (
    <nav>
      <div>
        <h1>{props.win ? 'You won!': 'You lost!'}</h1>
        <button onClick={props.restartGame}>Restart game</button>
        <button onClick={props.backToMenu}>Back to menu</button>
      </div>
    </nav>
  )
}
