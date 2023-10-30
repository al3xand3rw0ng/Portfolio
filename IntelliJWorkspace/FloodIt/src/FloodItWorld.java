import java.awt.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Random;

import javalib.impworld.World;
import javalib.impworld.WorldScene;
import javalib.worldimages.FontStyle;
import javalib.worldimages.Posn;
import javalib.worldimages.TextImage;

/**
 * Represents a game of FloodIt
 */
public class FloodItWorld extends World {
  // Size of the board (Represents both the number of rows and columns)
  private int boardSize;
  // Number of colors
  int numColor;
  // Number of user clicks
  int numClicks;
  // Maximum number of permitted user clicks
  int maxClicks;
  // The amount of time passed
  int clock;
  // Random variable
  Random r;
  // All the cells of the game
  ArrayList<ArrayList<Cell>> board;
  // If the user needs the game documentation
  Boolean needHelp;

  // Constructor used for testing purposes
  FloodItWorld(int boardSize, int numColor, Random r) {
    this.boardSize = boardSize;
    if (numColor > 8) {
      this.numColor = 8;
    } else {
      this.numColor = numColor;
    }
    this.numClicks = 0;
    this.maxClicks = (int) (this.boardSize * 2.5);
    this.clock = 0;
    this.r = r;
    // Calling the initBoard method to generate the game board
    this.board = this.initBoard();
    // Mutate the left, top, right, and bottom fields of each cell in the board
    this.addNeighbors();
    this.needHelp = false;
  }

  /**
   * Constructs this FloodItWorld
   *
   * @param boardSize the board size of this FloodItWorld
   * @param numColor  the number of colors available for this FloodItWorld
   */
  FloodItWorld(int boardSize, int numColor) {
    this.boardSize = boardSize;
    if (numColor > 8) {
      this.numColor = 8;
    } else {
      this.numColor = numColor;
    }
    this.numClicks = 0;
    this.maxClicks = (int) ((this.boardSize * 2.5) + (this.numColor / 2));
    this.clock = 0;
    this.r = new Random();
    // Calling the initBoard method to generate the game board
    this.board = this.initBoard();
    // Mutate the left, top, right, and bottom fields of each cell in the board
    this.addNeighbors();
    this.needHelp = false;
  }

  /**
   * To generate the initial game board
   *
   * @return the initial game board
   */
  ArrayList<ArrayList<Cell>> initBoard() {
    // The game board
    ArrayList<ArrayList<Cell>> board = new ArrayList<ArrayList<Cell>>();
    // Iterate until the board is correct size
    for (int y = 0; y < this.boardSize; y++) {
      // A row in the game board
      ArrayList<Cell> row = new ArrayList<Cell>();
      // Iterate until the column is the correct size
      for (int x = 0; x < this.boardSize; x++) {
        // Add a cell of a random color to the column
        // The cell is automatically flooded if it is in the top corner
        if (x == 0 && y == 0) {
          row.add(new Cell(x, y, this.getRandomColor(), true));
        } else {
          row.add(new Cell(x, y, this.getRandomColor(), false));
        }
      }
      // Add the row to the board
      board.add(row);
    }
    // Return the final game board
    return board;
  }

  // To get a random color for the cell
  Color getRandomColor() {
    // All eight possible colors
    ArrayList<Color> colors = new ArrayList<Color>(Arrays.asList(Color.RED, Color.ORANGE,
            Color.YELLOW, Color.GREEN, Color.CYAN, Color.BLUE, Color.MAGENTA, Color.GRAY));
    // Generate a random index
    int index = r.nextInt(this.numColor);
    // Return the random color
    return colors.get(index);
  }

  // To add the left, top, right, and bottom values to each cell
  // EFFECT: Mutates the left, top, right, and bottom fields for each cell in the
  // board
  void addNeighbors() {
    // For each row in the board
    for (ArrayList<Cell> row : this.board) {
      // For each cell in the row
      for (Cell cell : row) {
        // The left adjacent cell
        // If the cell is at the begining of the row, there is no cell to the left
        if (row.indexOf(cell) > 0) {
          cell.setLeft(row.get(row.indexOf(cell) - 1));
        }
        // The top adjacent cell
        // If the row is at the top of the board, there is no cell above
        if (this.board.indexOf(row) > 0) {
          cell.setTop(this.board.get(this.board.indexOf(row) - 1).get(row.indexOf(cell)));
        }
        // The right adjacent cell
        // If the cell is at the end of the row, there is no cell to the right
        if (row.indexOf(cell) < this.boardSize - 1) {
          cell.setRight(row.get(row.indexOf(cell) + 1));
        }
        // The bottom adjacent cell
        // If the row is at the bottom of the board, there is no cell below
        if (this.board.indexOf(row) < this.boardSize - 1) {
          cell.setBottom(this.board.get(this.board.indexOf(row) + 1).get(row.indexOf(cell)));
        }
      }
    }
  }

  // To visualize the flood it game
  @Override
  public WorldScene makeScene() {
    // Mutate the flooded field of the cells
    this.mutateFlooded();

    if (this.needHelp) {
      return this.help();
    }
    // If the user has already won the game, return the winning screen
    if (this.isWinner()) {
      return this.winner();
    }

    WorldScene background = new WorldScene(700, 700);
    // For every column in the board
    for (int column = 0; column < this.boardSize; column++) {
      // For every row in the board
      for (int row = 0; row < this.boardSize; row++) {
        // Place the cell at the desired coordinates
        background.placeImageXY(this.board.get(column).get(row).drawCell(500 / this.boardSize),
                ((500 / this.boardSize) / 2) + ((500 / this.boardSize) * row) + 100,
                ((500 / this.boardSize) / 2) + ((500 / this.boardSize) * column) + 100);
      }
    }

    TextImage helpMessage1 = new TextImage("Enter \"r\" to reset the board", 20, FontStyle.BOLD,
            Color.BLACK);
    TextImage helpMessage2 = new TextImage("Enter \"h\" to view "
            + "game documentation", 20, FontStyle.BOLD, Color.BLACK);
    // Display the number of current user clicks
    TextImage clickCounter = new TextImage(
            Integer.toString(this.numClicks) + "/" + Integer.toString(this.maxClicks), 25,
            FontStyle.BOLD, Color.BLACK);
    // Display the clock timer
    TextImage clockTimer = new TextImage("Time in seconds: " + Integer.toString(this.clock), 25,
            FontStyle.BOLD, Color.BLACK);
    background.placeImageXY(helpMessage1, 350, 20);
    background.placeImageXY(helpMessage2, 350, 40);
    background.placeImageXY(clockTimer, 350, 75);
    background.placeImageXY(clickCounter, 350, 650);

    // If the number of user clicks is equal to the maximum number of allowed
    // clicks, return the final screen
    if (this.numClicks == this.maxClicks) {
      // Check if the player has won
      if (this.isWinner()) {
        return this.winner();
      } else {
        return this.loser();
      }
    }
    return background;
  }

  // To determine if the player has won the game
  boolean isWinner() {
    // The number of cells that are not flooded
    int numFalse = 0;
    // Loop through each row in the board
    for (ArrayList<Cell> row : this.board) {
      // Loop through each cell in the row
      for (Cell cell : row) {
        // If the cell is not flooded, increment numFalse
        if (!(cell.getFlooded())) {
          numFalse++;
        }
      }
    }
    // If the number of cells that are not flooded is 0, the player is a winner
    return (numFalse == 0);
  }

  // To display the losing screen
  WorldScene loser() {
    TextImage text = new TextImage("Loser!", 150, FontStyle.BOLD, Color.BLACK);
    TextImage finalScore = new TextImage("Clicks to solution: " + Integer.toString(this.numClicks),
            25, FontStyle.BOLD, Color.BLACK);
    TextImage helpMessage = new TextImage("Enter \"r\" to reset the board", 25, FontStyle.BOLD,
            Color.BLACK);
    WorldScene background = new WorldScene(700, 700);
    background.placeImageXY(text, 350, 350);
    background.placeImageXY(finalScore, 350, 450);
    background.placeImageXY(helpMessage, 350, 500);
    return background;
  }

  // To display the winning screen
  WorldScene winner() {
    TextImage text = new TextImage("Winner!", 150, FontStyle.BOLD, Color.BLACK);
    TextImage finalScore = new TextImage("Clicks to solution: " + Integer.toString(this.numClicks),
            25, FontStyle.BOLD, Color.BLACK);
    TextImage helpMessage = new TextImage("Enter \"r\" to reset the board", 25, FontStyle.BOLD,
            Color.BLACK);
    WorldScene background = new WorldScene(700, 700);
    background.placeImageXY(text, 350, 350);
    background.placeImageXY(finalScore, 350, 450);
    background.placeImageXY(helpMessage, 350, 500);
    return background;
  }

  // To generate the documentation of the game functionality
  WorldScene help() {
    WorldScene background = new WorldScene(700, 700);

    String title = "FloodIt";
    String helpText1 = "The player must manipulate the grid of colors so that all of the cells";
    String helpText2 = "are of the same color. Starting in the upper left corner, by clicking";
    String helpText3 = "various colors they can change the color of that corner cell to increase";
    String helpText4 = "the size of the area of their control.";
    String helpText5 = "Game functionality:";
    String helpText6 = "Enter \"r\" to reset the game and create a new board.";
    String helpText7 = "Enter \"w\" to increment the size of the game board";
    String helpText8 = "Enter \"s\" to decrement the size of the game board (minimum size = 2)";
    String helpText9 = "Enter \"a\" to increment the number of colors (maximum number = 8)";
    String helpText10 = "Enter \"d\" to decrement the number of colors (minimum number = 2)";
    String helpText11 = "Enter \"h\" to display this screen.";
    String helpText12 = "Enter \"h\" to exit this screen.";

    TextImage titleImage = new TextImage(title, 40, Color.BLACK);
    TextImage text1 = new TextImage(helpText1, 20, Color.BLACK);
    TextImage text2 = new TextImage(helpText2, 20, Color.BLACK);
    TextImage text3 = new TextImage(helpText3, 20, Color.BLACK);
    TextImage text4 = new TextImage(helpText4, 20, Color.BLACK);
    TextImage text5 = new TextImage(helpText5, 20, Color.BLACK);
    TextImage text6 = new TextImage(helpText6, 20, Color.BLACK);
    TextImage text7 = new TextImage(helpText7, 20, Color.BLACK);
    TextImage text8 = new TextImage(helpText8, 20, Color.BLACK);
    TextImage text9 = new TextImage(helpText9, 20, Color.BLACK);
    TextImage text10 = new TextImage(helpText10, 20, Color.BLACK);
    TextImage text11 = new TextImage(helpText11, 20, Color.BLACK);
    TextImage text12 = new TextImage(helpText12, 20, Color.BLACK);

    background.placeImageXY(titleImage, 350, 40);
    background.placeImageXY(text1, 350, 80);
    background.placeImageXY(text2, 350, 100);
    background.placeImageXY(text3, 350, 120);
    background.placeImageXY(text4, 350, 140);
    background.placeImageXY(text5, 350, 180);
    background.placeImageXY(text6, 350, 200);
    background.placeImageXY(text7, 350, 220);
    background.placeImageXY(text8, 350, 240);
    background.placeImageXY(text9, 350, 260);
    background.placeImageXY(text10, 350, 280);
    background.placeImageXY(text11, 350, 300);
    background.placeImageXY(text12, 350, 320);

    return background;
  }

  // To handle key input and is given the key that has been pressed
  // EFFECT: The board is reset if the "r" key is pressed
  @Override
  public void onKeyEvent(String key) {
    // If "r" key is pressed, the board will reset
    if (key.equals("r")) {
      this.clock = 0;
      this.numClicks = 0;
      this.r = new Random();
      this.board = this.initBoard();
      this.addNeighbors();
    }
    // If the "w" key is pressed, the board size will increase
    if (key.equals("w")) {
      this.clock = 0;
      this.numClicks = 0;
      this.maxClicks = (int) ((this.boardSize * 2.5) + (this.numColor / 2));
      this.boardSize++;
      this.r = new Random();
      this.board = this.initBoard();
      this.addNeighbors();
    }
    // If the "s" key is pressed, the board size will decrease
    if (key.equals("s")) {
      if (this.boardSize != 2) {
        this.clock = 0;
        this.numClicks = 0;
        this.maxClicks = (int) ((this.boardSize * 2.5) + (this.numColor / 2));
        this.boardSize--;
        this.r = new Random();
        this.board = this.initBoard();
        this.addNeighbors();
      }
    }
    // If the "a" key is pressed, the number of colors will increase (maximum 8
    // colors)
    if (key.equals("a")) {
      if (this.numColor != 8) {
        this.clock = 0;
        this.numClicks = 0;
        this.maxClicks = (int) ((this.boardSize * 2.5) + (this.numColor / 2));
        this.numColor++;
        this.r = new Random();
        this.board = this.initBoard();
        this.addNeighbors();
      }
    }
    // If the "d" key is pressed, the number of colors will decrease (minimum 2
    // colors)
    if (key.equals("d")) {
      if (this.numColor != 2) {
        this.clock = 0;
        this.numClicks = 0;
        this.maxClicks = (int) ((this.boardSize * 2.5) + (this.numColor / 2));
        this.numColor--;
        this.r = new Random();
        this.board = this.initBoard();
        this.addNeighbors();
      }
    }
    // If the "h" key is pressed, documentation of detailed game functionality will
    // be displayed
    if (key.equals("h")) {
      if (!this.needHelp) {
        this.needHelp = true;
      } else {
        this.needHelp = false;
      }
    }
  }

  // To get the cell from the board at the given position
  Cell getCell(Posn pos) {
    Cell cell = this.board.get(Math.floorDiv(pos.y - 100, (500 / this.boardSize)))
            .get(Math.floorDiv(pos.x - 100, (500 / this.boardSize)));
    return cell;
  }

  // To handle if a mouse button is pressed
  // EFFECT: Update the game based on where the mouse is clicked
  @Override
  public void onMousePressed(Posn pos) {
    // Check if the x and y coordinates are within the coordinates of the board
    // boundaries
    if (pos.x >= 100 && pos.x <= 600 && pos.y >= 100 && pos.y <= 600) {
      if (this.numClicks < maxClicks) {
        // Increment the number of user clicks
        this.numClicks++;
        // Get the clicked cell
        Cell cell = this.getCell(pos);
        // Change color of flooded cells
        this.board.get(0).get(0).setColor(cell.getColor());
      }
    }
  }

  // To change the flooded field
  // EFFECT: Mutate the field from false to true
  void mutateFlooded() {
    // Loop through each row in the board
    for (ArrayList<Cell> row : this.board) {
      // Loop through each cell in the row
      for (Cell cell : row) {
        // If the cell is flooded, check each of its adjacent cells
        if (cell.getFlooded()) {
          // If the left cell is not an empty cell, and the left cell is the same color,
          // set its flooded field to true using an alias
          if (cell.getLeft() != new EmptyCell() && cell.getLeft().equalColor(cell.getColor())) {
            Cell cellToMutate = (Cell) cell.getLeft();
            cellToMutate.setFlooded(true);
          }
          // If the top cell is not an empty cell, and the top cell is the same color,
          // set its flooded field to true using an alias
          if (cell.getTop() != new EmptyCell() && cell.getTop().equalColor(cell.getColor())) {
            Cell cellToMutate = (Cell) cell.getTop();
            cellToMutate.setFlooded(true);
          }

          // If the right cell is not an empty cell, and the right cell is the same color,
          // set its flooded field to true using an alias
          if (cell.getRight() != new EmptyCell() && cell.getRight().equalColor(cell.getColor())) {
            Cell cellToMutate = (Cell) cell.getRight();
            cellToMutate.setFlooded(true);
          }
          // If the bottom cell is not an empty cell, and the bottom cell is the same
          // color,
          // set its flooded field to true using an alias
          if (cell.getBottom() != new EmptyCell() && cell.getBottom().equalColor(cell.getColor())) {
            Cell cellToMutate = (Cell) cell.getBottom();
            cellToMutate.setFlooded(true);
          }
        }
      }
    }
  }

  // To change the color of all flooded cells to the given color
  // EFFECT: Mutates the color field of a cell to the given color
  void changeFloodedCellColor(Color color) {
    for (ArrayList<Cell> row : this.board) {
      for (Cell cell : row) {
        // If the cell is flooded, change its color to the given color
        if (cell.getFlooded()) {
          cell.setColor(color);
        }
      }
    }
  }

  // To handle clock ticking
  // EFFECT: Mutates the clock field by incrementing the time and changes the
  // colors of the cells
  @Override
  public void onTick() {
    // Create a waterfall effect
    this.changeFloodedCellColor(this.board.get(0).get(0).getColor());
    // Update the clock
    this.clock++;
  }
}
