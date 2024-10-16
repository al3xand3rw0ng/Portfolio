package cs3500.marblesolitaire.view;

import java.io.IOException;

import cs3500.marblesolitaire.model.hw02.MarbleSolitaireModelState;

// Represents an instance of a marble solitaire text view
public class MarbleSolitaireTextView implements MarbleSolitaireView {

  private MarbleSolitaireModelState model;

  private Appendable ap;

  // Default Constructor
  // Prints the board based on the model object
  // Default to the console ( System.out ) as its default destination
  public MarbleSolitaireTextView(MarbleSolitaireModelState model) {
    if (model == null) {
      throw new IllegalArgumentException();
    }
    this.model = model;
    this.ap = System.out;
  }

  // New Constructor
  // Uses the given appendable as its destination
  public MarbleSolitaireTextView(MarbleSolitaireModelState model, Appendable ap) {
    if (model == null) {
      throw new IllegalArgumentException();
    }
    this.model = model;
    if (ap == null) {
      throw new IllegalArgumentException();
    }
    this.ap = ap;
  }

  /**
   * Return a string that represents the current state of the board. The
   * string should have one line per row of the game board. Each slot on the
   * game board is a single character (O, _ or space for a marble, empty and
   * invalid position respectively). Slots in a row should be separated by a
   * space. Each row has no space before the first slot and after the last slot.
   *
   * @return the game state as a string
   */
  public String toString() {
    String string = "";
    for (int x = 0; x < this.model.getBoardSize(); x++) {
      for (int y = 0; y < this.model.getBoardSize(); y++) {
        if (this.model.getSlotAt(x, y) == MarbleSolitaireModelState.SlotState.Empty) {
          string = string + "_ ";
        } else if (this.model.getSlotAt(x, y) == MarbleSolitaireModelState.SlotState.Marble) {
          if (y < this.model.getBoardSize() - 1) {
            string = string + "O ";
          } else {
            string = string + "O";
          }
        } else if (this.model.getSlotAt(x, y) == MarbleSolitaireModelState.SlotState.Invalid) {
          if (y < this.model.getBoardSize() / 2) {
            string = string + "  ";
          } else {
            break;
          }
        }
      }
      if (x < this.model.getBoardSize()) {
        string = string + "\n";
      }
    }
    return string;
  }

  @Override
  public void renderBoard() throws IOException {
    try {
      this.ap.append(this.toString());
    } catch (IOException ioException) {
    }
  }

  @Override
  public void renderMessage(String message) throws IOException {
    try {
      this.ap.append(message);
    } catch (IOException ioException) {
    }
  }
}




