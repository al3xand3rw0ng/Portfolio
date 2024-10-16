package cs3500.marblesolitaire.model.hw04;

import java.util.ArrayList;

import cs3500.marblesolitaire.model.hw02.Slot;

/**
 * Represents a European solitaire model
 */
public class EuropeanSolitaireModel extends AbstractSolitaireModel {
  //Empty Constructor
  //Creates an octagonal board whose sides have length 3, with the empty slot in the center of the board
  public EuropeanSolitaireModel() {
    super(3, 3, 3);
  }

  //Constructor that takes in a side length parameter
  //Creates a game with the specified side length, and the empty slot in the center of the board.
  public EuropeanSolitaireModel(int sideLength) {
    super(sideLength, ((sideLength - 1) + (sideLength / 2)), ((sideLength - 1) + (sideLength / 2)));
  }

  //Constructor with two parameters: row, col
  //Creates a game with the empty slot at (row, col) in a board of default size 3
  public EuropeanSolitaireModel(int row, int col) {
    super(3, row, col);
  }

  //Constructor with three parameters: side length, row, col
  //Creates a game with a specified size of the board and the initial position of the empty slot
  public EuropeanSolitaireModel(int size, int row, int col) {
    super(size, row, col);
  }

  /**
   * Checks if the given board position is out of invalid range
   *
   * @param sRow the row of the posn
   * @param sCol the column of the posn
   * @return a Boolean of true if the position is out of invalid range, or false if not
   */
  @Override
  public boolean inRange(int sRow, int sCol) {
    if (sRow < 0 || sCol > this.getBoardSize() - 1) {
      return false;
    } else if (sRow < (this.armThickness - 1)) {
      if (sCol < (this.armThickness - 1)) {
        if ((sRow + sCol) >= (this.armThickness - 1)) {
          return true;
        } else {
          return false;
        }
      } else if (sCol > ((2 * this.armThickness) - 2)) {
        if ((sCol - sRow) <= (((2 * this.armThickness) - 2))) {
          return true;
        } else {
          return false;
        }
      }
    } else if (sRow > ((2 * this.armThickness) - 2)) {
      if (sCol < (this.armThickness - 1)) {
        if ((sRow - sCol) <= (((2 * this.armThickness) - 2))) {
          return true;
        } else {
          return false;
        }
      } else if (sCol > ((2 * this.armThickness) - 2)) {
        if ((sRow + sCol) <= (Math.round((this.armThickness * 4) / 10.0) * 10)) {
          return true;
        } else {
          return false;
        }
      }
    }
    return true;
  }
}
