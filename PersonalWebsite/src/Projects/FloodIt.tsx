export default function FloodIt() {
  return (
    <div>
      <div className="text-center fs-3">
        <p>FloodIt</p>
      </div>
      <div>
        <p></p>
        <p>
          I created an adapted version of the strategy-based game of Flood-It
          with a partner. To play the game, a player must manipulate the grid of
          colors so that all of the cells are of the same color. Starting in the
          upper left corner, by clicking various colors they can change the
          color of that corner cell to increase the size of the area of their
          control. The player wins when the board is one color.
        </p>
        <div className="text-center">
          <video className="FloodIt" controls>
            <source src="/videos/flood_it.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <p>
          In addition to fulfilling the assignment parameters, my partner and I
          added additional functionality to create difficulty modifications to
          enhance the user experience. This includes creating controls to change
          the board size and number of colors and adding user help
          documentation.
        </p>
        <p>A demonstration of game functionality is shown above.</p>
      </div>
    </div>
  );
}
