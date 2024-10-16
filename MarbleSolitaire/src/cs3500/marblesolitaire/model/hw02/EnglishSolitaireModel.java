package cs3500.marblesolitaire.model.hw02;


import java.util.ArrayList;

import cs3500.marblesolitaire.model.hw04.AbstractSolitaireModel;

// Represents an English marble solitaire model
public class EnglishSolitaireModel extends AbstractSolitaireModel {
  //Empty Constructor
  //Initializes the game board with arm thickness 3 with center empty slot
  public EnglishSolitaireModel() {
    super(3, 3, 3);
  }

  //Constructor that takes in two parameters: sRow and sCol.
  //Initializes the game board with arm thickness 3 with empty slot at  (sRow, sCol).
  //Throws an IllegalArgumentException with a message "Invalid empty cell position (sRow, sCol)"
  //if this specified position is invalid
  public EnglishSolitaireModel(int sRow, int sCol) {
    super(3, sRow, sCol);
  }

  //Constructor that takes in arm thickness parameter
  //Initializes a game board with given arm thickness at the empty slot at the center
  //Throws an IllegalArgumentException if arm thickness is not positive odd number.
  public EnglishSolitaireModel(int armThickness) {
    super(armThickness, ((armThickness - 1) + (armThickness / 2)), ((armThickness - 1) + (armThickness / 2)));
  }

  //Constructor with three parameters: side length, row, col
  //Creates a game with a specified size of the board and the initial position of the empty slot
  public EnglishSolitaireModel(int armThickness, int sRow, int sCol) {
    super(armThickness, sRow, sCol);
  }

  /**
   * Checks if Posn is out of invalid range
   *
   * @param sRow the row of the posn
   * @param sCol the column of the posn
   * @return a Boolean of true if the posn is out of invalid range, or false if not
   */
  public boolean inRange(int sRow, int sCol) {
    if (sRow < 0 || sCol > this.getBoardSize() - 1) {
      return false;
    }

    if (sRow < (this.armThickness - 1)) {
      if (sCol < (this.armThickness - 1)) {
        return false;
      }

      if (sCol > ((2 * this.armThickness) - 2)) {
        return false;
      }
    }

    if (sRow > ((2 * this.armThickness) - 2)) {
      if (sCol < (this.armThickness - 1)) {
        return false;
      }

      if (sCol > ((2 * this.armThickness) - 2)) {
        return false;
      }
    }
    return true;
  }
}