export default function BallGame() {
  return (
    <div>
      <div className="text-center fs-3">
        <p>Ball Game</p>
      </div>
      <div>
        <p>
          This project was built using Python and the Pygame library, applying
          object-oriented design principles such as inheritance to reduce code
          duplication and enhance maintainability.
        </p>
        <p>
          The game challenges players to launch a ball at targets by clicking
          and dragging the mouse leftwards before releasing. The farther the
          mouse is dragged to the left before releasing, the faster and farther
          the ball will travel. To reset the ball to its original position,
          press the <strong>R</strong> key. Players can also toggle between
          difficulty modes by pressing the <strong>spacebar</strong>, which
          either keeps the flies idle or allows them to move dynamically. The
          player wins when all targets have been hit by the ball.
        </p>
        <div className="text-center">
          <embed
            src="https://al3xand3rw0ng.github.io/BallGame/"
            className="HeapOverflow"
          ></embed>
        </div>
        <p>
          Try the game here:{" "}
          <a href="https://al3xand3rw0ng.github.io/BallGame/">
            https://al3xand3rw0ng.github.io/BallGame/
          </a>
        </p>
      </div>
    </div>
  );
}
