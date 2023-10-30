package cs3500.marblesolitaire.controller;

// Represents a controller for a game of marble solitaire
public interface MarbleSolitaireController {
  /**
   * Plays a new game of Marble Solitaire
   *
   * @throws IllegalStateException if the controller is unable to successfully read input or transmit output
   */
  public void playGame() throws IllegalStateException;
}
