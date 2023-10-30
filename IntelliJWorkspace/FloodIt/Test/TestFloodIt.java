//import tester.Tester;
//
//import java.awt.Color;
//
//import java.util.ArrayList;
//import java.util.Arrays;
//import java.util.Random;
//
//import javalib.impworld.*;
//import javalib.worldimages.*;
//
//public class TestFloodIt {
//  public TestFloodIt() {
//  }
//
//  Cell cell1;
//  Cell cell2;
//  Cell cell3;
//  Cell cell4;
//  Cell cell5;
//  Cell cell6;
//  Cell cell7;
//  Cell cell8;
//  Cell cell9;
//
//  Cell cell10;
//  Cell cell11;
//  Cell cell12;
//  Cell cell13;
//
//  ArrayList<Cell> row1;
//  ArrayList<Cell> row2;
//  ArrayList<Cell> row3;
//
//  ArrayList<Cell> row4;
//  ArrayList<Cell> row5;
//
//  ArrayList<ArrayList<Cell>> board1;
//  ArrayList<ArrayList<Cell>> board2;
//
//  void InitCell() {
//    this.r = new Random(1);
//    this.floodItWorld = new FloodItWorld(3, 4, new Random(1));
//    this.cell1 = new Cell(0, 0, Color.YELLOW, true);
//    this.cell2 = new Cell(1, 0, Color.RED, false);
//    this.cell3 = new Cell(2, 0, Color.ORANGE, false);
//    this.cell4 = new Cell(0, 1, Color.ORANGE, false);
//    this.cell5 = new Cell(1, 1, Color.RED, false);
//    this.cell6 = new Cell(2, 1, Color.RED, false);
//    this.cell7 = new Cell(0, 2, Color.ORANGE, false);
//    this.cell8 = new Cell(1, 2, Color.YELLOW, false);
//    this.cell9 = new Cell(2, 2, Color.GREEN, false);
//
//    this.cell10 = new Cell(0, 0, Color.ORANGE, true);
//    this.cell11 = new Cell(1, 0, Color.RED, false);
//    this.cell12 = new Cell(0, 1, Color.ORANGE, false);
//    this.cell13 = new Cell(1, 1, Color.ORANGE, false);
//
//    this.row1 = new ArrayList<Cell>(Arrays.asList(this.cell1, this.cell2, this.cell3));
//    this.row2 = new ArrayList<Cell>(Arrays.asList(this.cell4, this.cell5, this.cell6));
//    this.row3 = new ArrayList<Cell>(Arrays.asList(this.cell7, this.cell8, this.cell9));
//
//    this.row4 = new ArrayList<Cell>(Arrays.asList(this.cell10, this.cell11));
//    this.row5 = new ArrayList<Cell>(Arrays.asList(this.cell12, this.cell13));
//
//    this.board1 = new ArrayList<ArrayList<Cell>>(Arrays.asList(this.row1, this.row2, this.row3));
//    this.board2 = new ArrayList<ArrayList<Cell>>(Arrays.asList(this.row4, this.row5));
//  }
//
//  void InitNeighbors() {
//    this.cell2.setLeft(this.cell1);
//    this.cell3.setLeft(this.cell2);
//    this.cell5.setLeft(this.cell4);
//    this.cell6.setLeft(this.cell5);
//    this.cell8.setLeft(this.cell7);
//    this.cell9.setLeft(this.cell8);
//
//    this.cell4.setTop(this.cell1);
//    this.cell5.setTop(this.cell2);
//    this.cell6.setTop(this.cell3);
//    this.cell7.setTop(this.cell4);
//    this.cell8.setTop(this.cell5);
//    this.cell9.setTop(this.cell6);
//
//    this.cell1.setRight(this.cell2);
//    this.cell2.setRight(this.cell3);
//    this.cell4.setRight(this.cell5);
//    this.cell5.setRight(this.cell6);
//    this.cell7.setRight(this.cell8);
//    this.cell8.setRight(this.cell9);
//
//    this.cell1.setBottom(this.cell4);
//    this.cell2.setBottom(this.cell5);
//    this.cell3.setBottom(this.cell6);
//    this.cell4.setBottom(this.cell7);
//    this.cell5.setBottom(this.cell8);
//    this.cell6.setBottom(this.cell9);
//
//    this.cell10.setRight(this.cell11);
//    this.cell10.setBottom(this.cell12);
//
//    this.cell11.setLeft(this.cell10);
//    this.cell11.setBottom(this.cell13);
//
//    this.cell12.setTop(this.cell10);
//    this.cell12.setRight(this.cell13);
//
//    this.cell13.setTop(this.cell11);
//    this.cell13.setLeft(this.cell12);
//  }
//
//  Random r = new Random(1);
//
//  ArrayList<Color> colors = new ArrayList<Color>(Arrays.asList(Color.RED, Color.ORANGE,
//          Color.YELLOW, Color.GREEN, Color.CYAN, Color.BLUE, Color.MAGENTA, Color.BLACK));
//
//  RectangleImage cell1Image = new RectangleImage(166, 166, OutlineMode.SOLID, Color.YELLOW);
//  RectangleImage cell2Image = new RectangleImage(166, 166, OutlineMode.SOLID, Color.RED);
//  RectangleImage cell3Image = new RectangleImage(166, 166, OutlineMode.SOLID, Color.ORANGE);
//  RectangleImage cell4Image = new RectangleImage(166, 166, OutlineMode.SOLID, Color.ORANGE);
//  RectangleImage cell5Image = new RectangleImage(166, 166, OutlineMode.SOLID, Color.RED);
//  RectangleImage cell6Image = new RectangleImage(166, 166, OutlineMode.SOLID, Color.RED);
//  RectangleImage cell7Image = new RectangleImage(166, 166, OutlineMode.SOLID, Color.ORANGE);
//  RectangleImage cell8Image = new RectangleImage(166, 166, OutlineMode.SOLID, Color.YELLOW);
//  RectangleImage cell9Image = new RectangleImage(166, 166, OutlineMode.SOLID, Color.GREEN);
//
//  FloodItWorld floodItWorld = new FloodItWorld(3, 4, new Random(1));
//
//  // To test the addLeft method
//  void testAddLeft(Tester t) {
//    this.InitCell();
//    this.InitNeighbors();
//
//    t.checkExpect(this.cell2.getLeft(), cell1);
//    t.checkExpect(this.cell3.getLeft(), cell2);
//    t.checkExpect(this.cell5.getLeft(), cell4);
//    t.checkExpect(this.cell6.getLeft(), cell5);
//    t.checkExpect(this.cell8.getLeft(), cell7);
//    t.checkExpect(this.cell9.getLeft(), cell8);
//  }
//
//  // To test the addTop method
//  void testAddTop(Tester t) {
//    this.InitCell();
//    this.InitNeighbors();
//
//    t.checkExpect(this.cell4.getTop(), cell1);
//    t.checkExpect(this.cell5.getTop(), cell2);
//    t.checkExpect(this.cell6.getTop(), cell3);
//    t.checkExpect(this.cell7.getTop(), cell4);
//    t.checkExpect(this.cell8.getTop(), cell5);
//    t.checkExpect(this.cell9.getTop(), cell6);
//  }
//
//  // To test the addRight method
//  void testAddRight(Tester t) {
//    this.InitCell();
//    this.InitNeighbors();
//
//    t.checkExpect(this.cell1.getRight(), cell2);
//    t.checkExpect(this.cell2.getRight(), cell3);
//    t.checkExpect(this.cell4.getRight(), cell5);
//    t.checkExpect(this.cell5.getRight(), cell6);
//    t.checkExpect(this.cell7.getRight(), cell8);
//    t.checkExpect(this.cell8.getRight(), cell9);
//  }
//
//  // To test the addBottom method
//  void testAddBottom(Tester t) {
//    this.InitCell();
//    this.InitNeighbors();
//
//    t.checkExpect(this.cell1.getBottom(), cell4);
//    t.checkExpect(this.cell2.getBottom(), cell5);
//    t.checkExpect(this.cell3.getBottom(), cell6);
//    t.checkExpect(this.cell4.getBottom(), cell7);
//    t.checkExpect(this.cell5.getBottom(), cell8);
//    t.checkExpect(this.cell6.getBottom(), cell9);
//  }
//
//  // To test the drawCell method
//  boolean testDrawCell(Tester t) {
//    this.InitCell();
//    this.InitNeighbors();
//
//    return t.checkExpect(this.cell1.drawCell(166), cell1Image)
//            && t.checkExpect(this.cell2.drawCell(166), cell2Image)
//            && t.checkExpect(this.cell4.drawCell(166), cell3Image)
//            && t.checkExpect(this.cell1.drawCell(166), cell8Image);
//  }
//
//  // To test the equalColor method
//  boolean testEqualColor(Tester t) {
//    this.InitCell();
//    this.InitNeighbors();
//    return t.checkExpect(this.cell1.equalColor(Color.YELLOW), true)
//            && t.checkExpect(this.cell1.equalColor(Color.RED), false)
//            && t.checkExpect(this.cell2.equalColor(Color.RED), true)
//            && t.checkExpect(this.cell2.equalColor(Color.GREEN), false)
//            && t.checkExpect(this.cell3.equalColor(Color.ORANGE), true)
//            && t.checkExpect(this.cell4.equalColor(Color.ORANGE), true);
//  }
//
//  // To test the InitBoard method
//  boolean testInitBoard(Tester t) {
//    this.InitCell();
//    this.InitNeighbors();
//
//    return t.checkExpect(this.floodItWorld.board, board1);
//  }
//
//  // To test the getRandomColor method
//  boolean testGetRandomColor(Tester t) {
//    this.InitCell();
//    this.InitNeighbors();
//    return t.checkExpect(this.floodItWorld.getRandomColor(), Color.YELLOW)
//            && t.checkExpect(new FloodItWorld(3, 4, new Random(2)).getRandomColor(), Color.GREEN)
//            && t.checkExpect(new FloodItWorld(10, 2, new Random(4)).getRandomColor(), Color.ORANGE)
//            && t.checkExpect(new FloodItWorld(11, 9, new Random(6)).getRandomColor(), Color.RED)
//            && t.checkExpect(new FloodItWorld(3, 8, new Random(9)).getRandomColor(), Color.ORANGE);
//
//  }
//
//  // To test the addNeighbors method
//  void testAddNeighbors(Tester t) {
//    this.InitCell();
//    this.InitNeighbors();
//
//    t.checkExpect(this.floodItWorld.board.get(0).get(0).getLeft(), new EmptyCell());
//    t.checkExpect(this.floodItWorld.board.get(0).get(0).getTop(), new EmptyCell());
//    t.checkExpect(this.floodItWorld.board.get(0).get(0).getRight(), this.cell2);
//    t.checkExpect(this.floodItWorld.board.get(0).get(0).getBottom(), this.cell4);
//  }
//
//  // To test the makeScene method
//  boolean testMakeScene(Tester t) {
//    this.InitCell();
//    this.InitNeighbors();
//    WorldScene background = new WorldScene(700, 700);
//    // For every column in the board
//    for (int column = 0; column < this.floodItWorld.boardSize; column++) {
//      // For every row in the board
//      for (int row = 0; row < this.floodItWorld.boardSize; row++) {
//        // Place the cell at the desired coordinates
//        background.placeImageXY(
//                this.floodItWorld.board.get(column).get(row)
//                        .drawCell(500 / this.floodItWorld.boardSize),
//                ((500 / this.floodItWorld.boardSize) / 2) + ((500 / this.floodItWorld.boardSize) * row)
//                        + 100,
//                ((500 / this.floodItWorld.boardSize) / 2)
//                        + ((500 / this.floodItWorld.boardSize) * column) + 100);
//      }
//    }
//
//    TextImage helpMessage = new TextImage("Enter \"r\" to reset the board", 20, FontStyle.BOLD,
//            Color.BLACK);
//    TextImage clickCounter = new TextImage("Time in seconds: 0", 25,
//            FontStyle.BOLD, Color.BLACK);
//    TextImage clockTimer = new TextImage("Enter \"h\" to view game documentation", 20,
//            FontStyle.BOLD, Color.BLACK);
//    TextImage clickCounter1 = new TextImage(
//            Integer.toString(0) + "/" + Integer.toString(7), 25,
//            FontStyle.BOLD, Color.BLACK);
//    background.placeImageXY(helpMessage, 350, 20);
//    background.placeImageXY(clockTimer, 350, 40);
//    background.placeImageXY(clickCounter, 350, 75);
//    background.placeImageXY(clickCounter1, 350, 650);
//
//    return t.checkExpect(this.floodItWorld.makeScene(), background);
//  }
//
//  // To test the isWinner method
//  void testIsWinner(Tester t) {
//    this.InitCell();
//    this.InitNeighbors();
//    t.checkExpect(this.floodItWorld.isWinner(), false);
//  }
//
//  // tests the loser method
//  void testLoser(Tester t) {
//    this.InitCell();
//    this.InitNeighbors();
//    TextImage text = new TextImage("Loser!", 150, FontStyle.BOLD, Color.BLACK);
//    TextImage finalScore = new TextImage("Clicks to solution: " + Integer.toString(0), 25,
//            FontStyle.BOLD, Color.BLACK);
//    TextImage helpMessage = new TextImage("Enter \"r\" to reset the board", 25, FontStyle.BOLD,
//            Color.BLACK);
//    WorldScene background = new WorldScene(700, 700);
//    background.placeImageXY(text, 350, 350);
//    background.placeImageXY(finalScore, 350, 450);
//    background.placeImageXY(helpMessage, 350, 500);
//    t.checkExpect(this.floodItWorld.loser(), background);
//  }
//
//  // tests the winner method
//  void testWinner(Tester t) {
//    this.InitCell();
//    this.InitNeighbors();
//    TextImage text = new TextImage("Winner!", 150, FontStyle.BOLD, Color.BLACK);
//    TextImage finalScore = new TextImage("Clicks to solution: " + Integer.toString(0), 25,
//            FontStyle.BOLD, Color.BLACK);
//    TextImage helpMessage = new TextImage("Enter \"r\" to reset the board", 25, FontStyle.BOLD,
//            Color.BLACK);
//    WorldScene background = new WorldScene(700, 700);
//    background.placeImageXY(text, 350, 350);
//    background.placeImageXY(finalScore, 350, 450);
//    background.placeImageXY(helpMessage, 350, 500);
//    t.checkExpect(this.floodItWorld.winner(), background);
//  }
//
//  // To test the help method
//  void testHelp(Tester t) {
//    this.InitCell();
//    this.InitNeighbors();
//    WorldScene background = new WorldScene(700, 700);
//
//    String title = "FloodIt";
//    String helpText1 = "The player must manipulate the grid of colors so that all of the cells";
//    String helpText2 = "are of the same color. Starting in the upper left corner, by clicking";
//    String helpText3 = "various colors they can change the color of that corner cell to increase";
//    String helpText4 = "the size of the area of their control.";
//    String helpText5 = "Game functionality:";
//    String helpText6 = "Enter \"r\" to reset the game and create a new board.";
//    String helpText7 = "Enter \"w\" to increment the size of the game board";
//    String helpText8 = "Enter \"s\" to decrement the size of the game board (minimum size = 2)";
//    String helpText9 = "Enter \"a\" to increment the number of colors (maximum number = 8)";
//    String helpText10 = "Enter \"d\" to decrement the number of colors (minimum number = 2)";
//    String helpText11 = "Enter \"h\" to display this screen.";
//    String helpText12 = "Enter \"h\" to exit this screen.";
//
//    TextImage titleImage = new TextImage(title, 40, Color.BLACK);
//    TextImage text1 = new TextImage(helpText1, 20, Color.BLACK);
//    TextImage text2 = new TextImage(helpText2, 20, Color.BLACK);
//    TextImage text3 = new TextImage(helpText3, 20, Color.BLACK);
//    TextImage text4 = new TextImage(helpText4, 20, Color.BLACK);
//    TextImage text5 = new TextImage(helpText5, 20, Color.BLACK);
//    TextImage text6 = new TextImage(helpText6, 20, Color.BLACK);
//    TextImage text7 = new TextImage(helpText7, 20, Color.BLACK);
//    TextImage text8 = new TextImage(helpText8, 20, Color.BLACK);
//    TextImage text9 = new TextImage(helpText9, 20, Color.BLACK);
//    TextImage text10 = new TextImage(helpText10, 20, Color.BLACK);
//    TextImage text11 = new TextImage(helpText11, 20, Color.BLACK);
//    TextImage text12 = new TextImage(helpText12, 20, Color.BLACK);
//
//    background.placeImageXY(titleImage, 350, 40);
//    background.placeImageXY(text1, 350, 80);
//    background.placeImageXY(text2, 350, 100);
//    background.placeImageXY(text3, 350, 120);
//    background.placeImageXY(text4, 350, 140);
//    background.placeImageXY(text5, 350, 180);
//    background.placeImageXY(text6, 350, 200);
//    background.placeImageXY(text7, 350, 220);
//    background.placeImageXY(text8, 350, 240);
//    background.placeImageXY(text9, 350, 260);
//    background.placeImageXY(text10, 350, 280);
//    background.placeImageXY(text11, 350, 300);
//    background.placeImageXY(text12, 350, 320);
//
//    t.checkExpect(this.floodItWorld.help(), background);
//  }
//
//
//  // To test the onKeyEvent method
//  void testOnKeyEvent(Tester t) {
//    this.InitCell();
//    this.InitNeighbors();
//    this.floodItWorld.onKeyEvent("r");
//    t.checkExpect(this.floodItWorld.board, this.floodItWorld.board);
//    t.checkExpect(this.floodItWorld, this.floodItWorld);
//    this.floodItWorld.onKeyEvent("w");
//    t.checkExpect(this.floodItWorld.boardSize, 4);
//    this.floodItWorld.onKeyEvent("s");
//    this.floodItWorld.onKeyEvent("s");
//    t.checkExpect(this.floodItWorld.boardSize, 2);
//    this.floodItWorld.onKeyEvent("a");
//    t.checkExpect(this.floodItWorld, this.floodItWorld);
//    t.checkExpect(this.floodItWorld.numColor, 5);
//    this.floodItWorld.onKeyEvent("a");
//    this.floodItWorld.onKeyEvent("a");
//    t.checkExpect(this.floodItWorld.numColor, 7);
//    this.floodItWorld.onKeyEvent("d");
//    t.checkExpect(this.floodItWorld, this.floodItWorld);
//    t.checkExpect(this.floodItWorld.numColor, 6);
//    this.floodItWorld.needHelp.equals(false);
//    this.floodItWorld.onKeyEvent("h");
//    t.checkExpect(this.floodItWorld, this.floodItWorld);
//    this.floodItWorld.needHelp.equals(true);
//  }
//
//  // tests the getCell method
//  void testGetCell(Tester t) {
//    this.InitCell();
//    this.InitNeighbors();
//    t.checkExpect(this.floodItWorld.getCell(new Posn(150, 150)), cell1);
//    t.checkExpect(this.floodItWorld.getCell(new Posn(400, 150)), cell2);
//    t.checkExpect(this.floodItWorld.getCell(new Posn(500, 150)), cell3);
//    t.checkExpect(this.floodItWorld.getCell(new Posn(120, 310)), cell4);
//    t.checkExpect(this.floodItWorld.getCell(new Posn(300, 310)), cell5);
//    t.checkExpect(this.floodItWorld.getCell(new Posn(450, 310)), cell6);
//    t.checkExpect(this.floodItWorld.getCell(new Posn(200, 440)), cell7);
//    t.checkExpect(this.floodItWorld.getCell(new Posn(310, 440)), cell8);
//    t.checkExpect(this.floodItWorld.getCell(new Posn(440, 440)), cell9);
//  }
//
//  // To Test the onMousePressed method
//  void testOnMouesePressed(Tester t) {
//    this.InitCell();
//    this.InitNeighbors();
//
//    this.floodItWorld.onMousePressed(new Posn(150, 150));
//    t.checkExpect(this.floodItWorld.numClicks, 1);
//    this.floodItWorld.onMousePressed(new Posn(200, 300));
//    t.checkExpect(this.floodItWorld.numClicks, 2);
//    this.floodItWorld.onMousePressed(new Posn(200, 10000));
//    t.checkExpect(this.floodItWorld.numClicks, 2);
//    this.floodItWorld.onMousePressed(new Posn(200, 1));
//    t.checkExpect(this.floodItWorld.numClicks, 2);
//    this.floodItWorld.onMousePressed(new Posn(300, 400));
//    t.checkExpect(this.floodItWorld.numClicks, 3);
//
//    this.floodItWorld.onMousePressed(new Posn(400, 150));
//    t.checkExpect(this.floodItWorld.board.get(0).get(0).color, Color.RED);
//    this.floodItWorld.onMousePressed(new Posn(277, 277));
//    t.checkExpect(this.floodItWorld.board.get(0).get(0).color, Color.RED);
//    this.floodItWorld.onMousePressed(new Posn(500, 500));
//    t.checkExpect(this.floodItWorld.board.get(0).get(0).color, Color.GREEN);
//    this.floodItWorld.onMousePressed(new Posn(300, 500));
//    t.checkExpect(this.floodItWorld.board.get(1).get(1).color, Color.RED);
//    this.floodItWorld.onMousePressed(new Posn(300, 200));
//    t.checkExpect(this.floodItWorld.board.get(2).get(2).color, Color.GREEN);
//
//
//  }
//
//  // To Test the mutateFlooded method
//  void testMutateFlooded(Tester t) {
//    this.InitCell();
//    this.InitNeighbors();
//    this.floodItWorld.mutateFlooded();
//    t.checkExpect(this.floodItWorld.board.get(0).get(0).flooded, true);
//    t.checkExpect(this.floodItWorld.board.get(0).get(1).flooded, false);
//    t.checkExpect(this.floodItWorld.board.get(0).get(2).flooded, false);
//    t.checkExpect(this.floodItWorld.board.get(1).get(0).flooded, false);
//    t.checkExpect(this.floodItWorld.board.get(1).get(1).flooded, false);
//    t.checkExpect(this.floodItWorld.board.get(1).get(2).flooded, false);
//    t.checkExpect(this.floodItWorld.board.get(2).get(0).flooded, false);
//    t.checkExpect(this.floodItWorld.board.get(2).get(1).flooded, false);
//    t.checkExpect(this.floodItWorld.board.get(2).get(2).flooded, false);
//
//    this.cell1 = new Cell(0, 0, Color.YELLOW, true);
//    this.cell2 = new Cell(1, 0, Color.RED, true);
//    this.cell3 = new Cell(2, 0, Color.ORANGE, true);
//    this.cell4 = new Cell(0, 1, Color.ORANGE, true);
//    this.cell5 = new Cell(1, 1, Color.RED, true);
//    this.cell6 = new Cell(2, 1, Color.RED, true);
//    this.cell7 = new Cell(0, 2, Color.ORANGE, false);
//    this.cell8 = new Cell(1, 2, Color.YELLOW, true);
//    this.cell9 = new Cell(2, 2, Color.GREEN, true);
//
//    this.row1 = new ArrayList<Cell>(Arrays.asList(this.cell1, this.cell2, this.cell3));
//    this.row2 = new ArrayList<Cell>(Arrays.asList(this.cell4, this.cell5, this.cell6));
//    this.row3 = new ArrayList<Cell>(Arrays.asList(this.cell7, this.cell8, this.cell9));
//
//    this.board1 = new ArrayList<ArrayList<Cell>>(Arrays.asList(this.row1, this.row2, this.row3));
//    t.checkExpect(this.board1.get(0).get(0).flooded, true);
//    t.checkExpect(this.board1.get(1).get(0).flooded, true);
//    t.checkExpect(this.board1.get(2).get(0).flooded, false);
//    t.checkExpect(this.board1.get(0).get(1).flooded, true);
//    t.checkExpect(this.board1.get(1).get(1).flooded, true);
//    t.checkExpect(this.board1.get(2).get(1).flooded, true);
//    t.checkExpect(this.board1.get(0).get(2).flooded, true);
//    t.checkExpect(this.board1.get(1).get(2).flooded, true);
//    t.checkExpect(this.board1.get(2).get(2).flooded, true);
//  }
//
//  // To test the changeFloodedCellColor method
//  void testChangeFloodedCellColor(Tester t) {
//    this.InitCell();
//    this.InitNeighbors();
//
//    this.floodItWorld.changeFloodedCellColor(Color.BLUE);
//    t.checkExpect(this.floodItWorld.board.get(0).get(0).color, Color.BLUE);
//
//    this.floodItWorld.changeFloodedCellColor(Color.YELLOW);
//    t.checkExpect(this.floodItWorld.board.get(0).get(0).color, Color.YELLOW);
//
//    this.floodItWorld.changeFloodedCellColor(Color.GREEN);
//    t.checkExpect(this.floodItWorld.board.get(0).get(0).color, Color.GREEN);
//
//    this.floodItWorld.changeFloodedCellColor(Color.RED);
//    t.checkExpect(this.floodItWorld.board.get(0).get(0).color, Color.RED);
//
//    this.floodItWorld.changeFloodedCellColor(Color.BLACK);
//    t.checkExpect(this.floodItWorld.board.get(0).get(0).color, Color.BLACK);
//
//    this.floodItWorld.changeFloodedCellColor(Color.RED);
//    t.checkExpect(this.floodItWorld.board.get(1).get(1).color, Color.RED);
//
//    this.floodItWorld.changeFloodedCellColor(Color.YELLOW);
//    t.checkExpect(this.floodItWorld.board.get(1).get(1).color, Color.RED);
//    t.checkExpect(this.floodItWorld.board.get(2).get(2).color, Color.GREEN);
//
//  }
//
//  // To test the onTick
//  void testOnTick(Tester t) {
//    this.InitCell();
//    this.InitNeighbors();
//    this.floodItWorld.onTick();
//    t.checkExpect(this.floodItWorld.clock, 1);
//    t.checkExpect(this.floodItWorld.board.get(0).get(0).color, Color.YELLOW);
//    this.floodItWorld.onTick();
//    t.checkExpect(this.floodItWorld.clock, 2);
//    t.checkExpect(this.floodItWorld.board.get(2).get(2).color, Color.GREEN);
//    this.floodItWorld.onTick();
//    this.floodItWorld.onTick();
//    this.floodItWorld.onTick();
//    t.checkExpect(this.floodItWorld.clock, 5);
//    t.checkExpect(this.floodItWorld.board.get(1).get(1).color, Color.RED);
//  }
//
//  // runs the game by creating a world and calling bigBang
//  void testFloodIt(Tester t) {
//    this.InitCell();
//    this.InitNeighbors();
//    FloodItWorld floodItWorld = new FloodItWorld(5, 6);
//    floodItWorld.bigBang(700, 700, 1);
//  }
//}
