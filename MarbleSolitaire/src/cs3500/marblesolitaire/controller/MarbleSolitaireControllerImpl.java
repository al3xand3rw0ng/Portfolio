package cs3500.marblesolitaire.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Scanner;

import cs3500.marblesolitaire.model.hw02.MarbleSolitaireModel;
import cs3500.marblesolitaire.view.MarbleSolitaireTextView;
import cs3500.marblesolitaire.view.MarbleSolitaireView;

/**
 * Represents an implementation of a marble solitaire controller
 */
public class MarbleSolitaireControllerImpl implements MarbleSolitaireController {
  private MarbleSolitaireModel model;
  private MarbleSolitaireView view;
  private Readable rd;
  private Scanner scanner;
  private boolean quit;

  /**
   * Constructs an implementation of a marble solitaire controller
   *
   * @param model the model used in this game
   * @param view  the view used in this game
   * @param rd    the Readable object from which to read input
   * @throws IllegalArgumentException if any of the parameters are null
   */
  public MarbleSolitaireControllerImpl(MarbleSolitaireModel model, MarbleSolitaireTextView view, Readable rd) throws IllegalArgumentException {
    if (model == null || view == null || rd == null) {
      throw new IllegalArgumentException();
    } else {
      this.model = model;
      this.view = view;
      this.rd = rd;
      this.scanner = new Scanner(rd);
      this.quit = false;
    }
  }

  /**
   * Plays a new game of Marble Solitaire
   *
   * @throws IllegalStateException if the controller is unable to successfully read input or transmit output
   */
  @Override
  public void playGame() throws IllegalStateException {
    while ((!this.model.isGameOver()) && (!this.quit)) {
      try {
        // Render the current state of the board
        this.view.renderBoard();
        this.view.renderMessage("\n");
        // Render the user's current score
        this.view.renderMessage("Score: " + this.model.getScore() + "\n");
      } catch (IOException e) {
        throw new IllegalStateException(e);
      }

      // Collect user input
      ArrayList<String> inputs = new ArrayList<String>();
      try {
        this.view.renderMessage("Enter the row number of the position from where a marble is to be moved, beginning at 1:\n");
        inputs.add(this.value());
        this.view.renderMessage("Enter the column number of the position from where a marble is to be moved, beginning at 1:\n");
        inputs.add(this.value());
        this.view.renderMessage("Enter the row number of the position to where a marble is to be moved, beginning at 1:\n");
        inputs.add(this.value());
        this.view.renderMessage("Enter the column number of the position to where a marble is to be moved, beginning at 1:\n");
        inputs.add(this.value());
      } catch (IOException e) {
        throw new IllegalStateException(e);
      }

      // Pass the information on to the model to make the move
      try {
        this.model.move(Integer.parseInt(inputs.get(0)),
                Integer.parseInt(inputs.get(1)),
                Integer.parseInt(inputs.get(2)),
                Integer.parseInt(inputs.get(3)));
      } catch (IllegalArgumentException e) {
        try {
          this.view.renderMessage("Invalid move. Play again." + "\n");
        } catch (IOException ex) {
          throw new IllegalStateException(e);
        }
      }
    }

    // If the game is over, the controller will transmit a game over message,
    // the final state of the board, and the final score
    if (this.quit) {

    }

    if (this.model.isGameOver()) {
      try {
        this.view.renderMessage("Game over!\n");
        this.view.renderMessage("Final state of game:\n");
        this.view.renderBoard();
        this.view.renderMessage("\n");
        this.view.renderMessage("Score: " + this.model.getScore() + "\n");
        System.exit(0);
      } catch (IOException e) {
        throw new IllegalStateException(e);
      }
    }
  }

  /**
   * Collects input from the user and verifies its value
   *
   * @return the valid value entered by the user
   */
  public String value() {
    String input = scanner.next().toString();

    if (Character.isDigit(input.charAt(0))) {
      int intInput = Integer.parseInt(input);
      if (intInput < 0) {
        try {
          this.view.renderMessage("Invalid input! Enter a positive integer or the letter \'q\' or \'Q\' to quit");
          this.value();
        } catch (IOException e) {
          throw new IllegalStateException(e);
        }
      } else if (intInput >= 0) {
        return Integer.toString(intInput);
      }
    } else if (Character.isLetter(input.charAt(0))) {
      if (input.toUpperCase().equals("Q")) {
        try {
          this.setQuit(true);
          this.view.renderMessage("Game quit!\n");
          this.view.renderMessage("State of game when quit:\n");
          this.view.renderBoard();
          this.view.renderMessage("Score: " + this.model.getScore() + "\n");
          System.exit(0);
        } catch (IOException e) {
          throw new IllegalStateException(e);
        }
      } else {
        try {
          this.view.renderMessage("Invalid input! Enter a positive integer or the letter \'q\' or \'Q\' to quit");
          this.value();
        } catch (IOException e) {
          throw new IllegalStateException(e);
        }
      }
    }
    return input;
  }

  /**
   * Get this MarbleSolitaireControllerImpl's model
   *
   * @return the model
   */
  public MarbleSolitaireModel getModel() {
    return this.model;
  }

  /**
   * Set this MarbleSolitaireControllerImpl's model
   *
   * @param model the model to use
   */
  public void setModel(MarbleSolitaireModel model) {
    this.model = model;
  }

  /**
   * Get this MarbleSolitaireControllerImpl's view
   *
   * @return the view
   */
  public MarbleSolitaireView getView() {
    return this.view;
  }

  /**
   * Get this MarbleSolitaireControllerImpl's readable object
   *
   * @return the readable object
   */
  public Readable getRd() {
    return this.rd;
  }

  /**
   * Determine if the game has been quit
   *
   * @return a boolean determining if the game has been quit or not
   */
  public boolean isQuit() {
    return this.quit;
  }

  /**
   * Set the value of this MarbleSolitaireControllerImpl's isQuit field
   *
   * @param quit a boolean determining if the game has been quit or not
   */
  public void setQuit(boolean quit) {
    this.quit = quit;
  }
}
