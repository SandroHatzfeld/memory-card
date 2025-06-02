import { difficulties } from "../data/difficulties"

export default function Menu({
  setDifficulty,
}: {
  setDifficulty: (cardCount: number) => void
}) {
  return (
    <nav>
      <div>
        <div>
          <h2>Welcome to the Webdev Memory Game.</h2>
          <p>
            Choose a difficulty to start playing. Try to click all cards without
            clicking the same card twice!{" "}
          </p>
          <p>Good luck!</p>
        </div>
        <div className="button-wrapper">
          {difficulties.map((difficulty, index) => {
            return (
              <button
                key={difficulty.name}
                onClick={() => setDifficulty(index)}
              >
                {difficulty.name}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
