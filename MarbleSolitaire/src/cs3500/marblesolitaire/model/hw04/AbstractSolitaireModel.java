package cs3500.marblesolitaire.model.hw04;

import java.util.ArrayList;

import cs3500.marblesolitaire.model.hw02.MarbleSolitaireModel;
import cs3500.marblesolitaire.model.hw02.Slot;

public abstract class AbstractSolitaireModel implements MarbleSolitaireModel {
  protected int armThickness;
  protected int sRow;
  protected int sCol;
  protected ArrayList<ArrayList<Slot>> gameBoard;

  public AbstractSolitaireModel(int armThickness, int sRow, int sCol) {
    this.armThickness = armThickness;
    this.sRow = sRow;
    this.sCol = sCol;
    this.gameBoard = new ArrayList<ArrayList<Slot>>();

    if (this.armThickness < 0) {
      throw new IllegalArgumentException();
    }

    if (this.armThickness % 2 == 0) {
      throw new IllegalArgumentException();
    }

    if (!this.inRange(sRow, sCol)) {
      throw new IllegalArgumentException("Invalid empty cell position (" + this.sRow + ","
              + this.sCol + ")");
    }

    this.initBoard(sRow, sCol);
  }

  /**
   * Return the size of this board. The size is roughly the longest dimension of a board
   *
   * @return the size as an integer
   */
  @Override
  public int getBoardSize() {
    return ((3 * this.armThickness) - 2);
  }

  /**
   * Get the state of the slot at a given position on the board.
   *
   * @param row the row of the position sought, starting at 0
   * @param col the column of the position sought, starting at 0
   * @return the state of the slot at the given row and column
   * @throws IllegalArgumentException if the row or the column are beyond
   *                                  the dimensions of the board
   */
  @Override
  public SlotState getSlotAt(int row, int col) {
    if ((row > this.getBoardSize() - 1) || (col > this.getBoardSize() - 1)) {
      throw new IllegalArgumentException("Beyond the dimensions of the board");
    }
    return gameBoard.get(row).get(col).getSlotStatus();
  }

  /**
   * Return the number of marbles currently on the board.
   *
   * @return the number of marbles currently on the board
   */
  @Override
  public int getScore() {
    int temp = 0;
    for (int i = 0; i < this.getBoardSize(); i++) {
      for (int j = 0; j < this.getBoardSize(); j++) {
        if (gameBoard.get(i).get(j).getSlotStatus().equals(SlotState.Marble)) {
          temp++;
        }
      }
    }
    return temp;
  }

  /**
   * Move a single marble from a given position to another given position.
   * A move is valid only if the from and to positions are valid. Specific
   * implementations may place additional constraints on the validity of a move.
   *
   * @param fromRow the row number of the position to be moved from
   *                (starts at 0)
   * @param fromCol the column number of the position to be moved from
   *                (starts at 0)
   * @param toRow   the row number of the position to be moved to
   *                (starts at 0)
   * @param toCol   the column number of the position to be moved to
   *                (starts at 0)
   * @throws IllegalArgumentException if the move is not possible
   */
  @Override
  public void move(int fromRow, int fromCol, int toRow, int toCol) {

    if (!this.validMove(fromRow, fromCol, toRow, toCol)) {
      throw new IllegalArgumentException("Invalid Move");
    }
    this.moveHelp(fromRow, fromCol, toRow, toCol);
  }

  /**
   * Determine and return if the game is over or not. A game is over if no
   * more moves can be made.
   *
   * @return true if the game is over, false otherwise
   */
  @Override
  public boolean isGameOver() {
    if (this.getScore() == 0) {
      return true;
    }

    for (int i = 0; i < this.getBoardSize(); i++) {
      for (int j = 0; j < this.getBoardSize(); j++) {
        if (this.inRange(i, j)) {
          if (this.inRange(i - 2, j)) {
            if (this.validMove(i, j, i - 2, j)) {
              return false;
            }
          }
          if (this.inRange(i + 2, j)) {
            if (this.validMove(i, j, i + 2, j)) {
              return false;
            }
          }
          if (this.inRange(i, j - 2)) {
            if (this.validMove(i, j, i, j - 2)) {
              return false;
            }
          }
          if (this.inRange(i, j + 2)) {
            if (this.validMove(i, j, i, j + 2)) {
              return false;
            }
          }
        }
      }
    }
    return true;
  }

  /**
   * Checks if the given board position is out of invalid range
   *
   * @param sRow the row of the posn
   * @param sCol the column of the posn
   * @return a Boolean of true if the position is out of invalid range, or false if not
   */
  public abstract boolean inRange(int sRow, int sCol);

  /**
   * Create the initial game board
   *
   * @param sRow the row number of the empty center slot
   * @param sCol the column number of the empty center slot
   */
  protected void initBoard(int sRow, int sCol) {
    for (int x = 0; x < this.getBoardSize(); x++) {
      ArrayList<Slot> row = new ArrayList<Slot>();
      for (int y = 0; y < this.getBoardSize(); y++) {
        if (this.inRange(x, y)) {
          if ((x == sRow) && (y == sCol)) {
            row.add(new Slot(SlotState.Empty));
          } else {
            row.add(new Slot(SlotState.Marble));
          }
        } else {
          row.add(new Slot(SlotState.Invalid));
        }
      }
      this.gameBoard.add(row);
    }
  }

  /**
   * To get the game board
   *
   * @return the game board of this solitaire model
   */
  public ArrayList<ArrayList<Slot>> getGameBoard() {
    return this.gameBoard;
  }

  /**
   * Checks if there are any valid moves left
   *
   * @param fromRow the row number of the from cell
   * @param fromCol the column number of the from cell
   * @param toRow   the row number of the to cell
   * @param toCol   the column number of the to cell
   * @return a Boolean of true if there are valid moves left, or false if not
   */
  public boolean validMove(int fromRow, int fromCol, int toRow, int toCol) {

    if (!this.inRange(fromRow, fromCol)) {
      return false;
    }

    if (!this.inRange(toRow, toCol)) {
      return false;
    }

    if (this.getSlotAt(fromRow, fromCol) != SlotState.Marble) {
      return false;
    }

    if (this.getSlotAt(toRow, toCol) != SlotState.Empty) {
      return false;
    }

    if (!this.twoPoint(fromRow, fromCol, toRow, toCol)) {
      return false;
    }

    int midRow = 0;
    int midCol = 0;

    if (Math.abs(fromCol - toCol) == 2) {
      midRow = fromRow;
      if (fromCol > toCol) {
        midCol = fromCol - 1;
      } else {
        midCol = fromCol + 1;
      }
    } else {
      midCol = fromCol;
      if (fromRow > toRow) {
        midRow = fromRow - 1;
      } else {
        midRow = fromRow + 1;
      }
    }

    if (getSlotAt(midRow, midCol) != SlotState.Marble) {
      return false;
    }

    return true;
  }

  /**
   * Helper function for move that changes gameBoard
   *
   * @param fromRow the row number of the from cell
   * @param fromCol the column number of the from cell
   * @param toRow   the row number of the to cell
   * @param toCol   the column number of the to cell
   */
  public void moveHelp(int fromRow, int fromCol, int toRow, int toCol) {
    int midRow = 0;
    int midCol = 0;

    if (Math.abs(fromCol - toCol) == 2) {
      midRow = fromRow;
      if (fromCol > toCol) {
        midCol = fromCol - 1;
      } else {
        midCol = fromCol + 1;
      }
    } else {
      midCol = fromCol;
      if (fromRow > toRow) {
        midRow = fromRow - 1;
      } else {
        midRow = fromRow + 1;
      }
    }

    this.gameBoard.get(fromRow).get(fromCol).setSlotStatus(SlotState.Empty);
    this.gameBoard.get(midRow).get(midCol).setSlotStatus(SlotState.Empty);
    this.gameBoard.get(toRow).get(toCol).setSlotStatus(SlotState.Marble);
  }

  /**
   * Checks if two points are two away from each other vertically or horizontally
   *
   * @param fromRow the row number of the from cell
   * @param fromCol the column number of the from cell
   * @param toRow   the row number of the to cell
   * @param toCol   the column number of the to cell
   * @return a Boolean of true if two points are two away from each other vertically or
   * horizontally, or false if not
   */
  public boolean twoPoint(int fromRow, int fromCol, int toRow, int toCol) {
    boolean valid = false;
    if ((fromRow == toRow) && (Math.abs(fromCol - toCol) == 2)) {
      valid = true;
    }
    if ((fromCol == toCol) && (Math.abs(fromRow - toRow) == 2)) {
      valid = true;
    }
    return valid;
  }
}
