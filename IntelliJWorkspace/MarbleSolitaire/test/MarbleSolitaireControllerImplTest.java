import org.junit.Test;

import java.io.*;

import cs3500.marblesolitaire.controller.MarbleSolitaireControllerImpl;
import cs3500.marblesolitaire.model.hw02.EnglishSolitaireModel;
import cs3500.marblesolitaire.view.MarbleSolitaireTextView;

import static org.junit.Assert.*;

public class MarbleSolitaireControllerImplTest {

  @Test
  public void testConstructor() {
    EnglishSolitaireModel englishSolitaireModel = new EnglishSolitaireModel();
    String string = "";
    StringBuilder output = new StringBuilder(string);
    MarbleSolitaireTextView marbleSolitaireTextView = new MarbleSolitaireTextView(englishSolitaireModel, output);
    StringReader input = new StringReader(string);
    MarbleSolitaireControllerImpl marbleSolitaireControllerImpl = new MarbleSolitaireControllerImpl(englishSolitaireModel, marbleSolitaireTextView, input);

    assertEquals(marbleSolitaireControllerImpl.getModel(), englishSolitaireModel);
    assertEquals(marbleSolitaireControllerImpl.getView(), marbleSolitaireTextView);
    assertEquals(marbleSolitaireControllerImpl.getRd(), input);

    try {
      MarbleSolitaireControllerImpl nullModel = new MarbleSolitaireControllerImpl(null, marbleSolitaireTextView, input);
      fail("Tried to create an invalid MarbleSolitaireControllerImpl and " +
              "did not see an IllegalArgumentException!");
    } catch (IllegalArgumentException e) {
    }

    try {
      MarbleSolitaireControllerImpl nullView = new MarbleSolitaireControllerImpl(englishSolitaireModel, null, input);
      fail("Tried to create an invalid MarbleSolitaireControllerImpl and " +
              "did not see an IllegalArgumentException!");
    } catch (IllegalArgumentException e) {
    }

    try {
      MarbleSolitaireControllerImpl nullRd = new MarbleSolitaireControllerImpl(englishSolitaireModel, marbleSolitaireTextView, null);
      fail("Tried to create an invalid MarbleSolitaireControllerImpl and " +
              "did not see an IllegalArgumentException!");
    } catch (IllegalArgumentException e) {
    }
  }

  @Test
  public void testPlayGame() {
    EnglishSolitaireModel englishSolitaireModel = new EnglishSolitaireModel();
    StringWriter output = new StringWriter();
    MarbleSolitaireTextView marbleSolitaireTextView = new MarbleSolitaireTextView(englishSolitaireModel, output);
    StringReader input = new StringReader("q");
    MarbleSolitaireControllerImpl marbleSolitaireControllerImpl = new MarbleSolitaireControllerImpl(englishSolitaireModel, marbleSolitaireTextView, input);
    marbleSolitaireControllerImpl.value();
    marbleSolitaireControllerImpl.playGame();
    assertEquals("Game quit!\n" +
            "State of game when quit:\n" +
            "    O O O \n" +
            "    O O O \n" +
            "O O O O O O O\n" +
            "O O O _ O O O\n" +
            "O O O O O O O\n" +
            "    O O O \n" +
            "    O O O \n" +
            "Score: 32", output.toString());

    englishSolitaireModel = new EnglishSolitaireModel();
    output = new StringWriter();
    marbleSolitaireTextView = new MarbleSolitaireTextView(englishSolitaireModel, output);
    input = new StringReader("Q");
    marbleSolitaireControllerImpl = new MarbleSolitaireControllerImpl(englishSolitaireModel, marbleSolitaireTextView, input);
    marbleSolitaireControllerImpl.value();
    marbleSolitaireControllerImpl.playGame();
    assertEquals("Game quit!\n" +
            "State of game when quit:\n" +
            "    O O O \n" +
            "    O O O \n" +
            "O O O O O O O\n" +
            "O O O _ O O O\n" +
            "O O O O O O O\n" +
            "    O O O \n" +
            "    O O O \n" +
            "Score: 32", output.toString());

    englishSolitaireModel = new EnglishSolitaireModel();
    englishSolitaireModel.move(1, 3, 3, 3);
    output = new StringWriter();
    marbleSolitaireTextView = new MarbleSolitaireTextView(englishSolitaireModel, output);
    input = new StringReader("q");
    marbleSolitaireControllerImpl = new MarbleSolitaireControllerImpl(englishSolitaireModel, marbleSolitaireTextView, input);
    try {
      marbleSolitaireControllerImpl.getView().renderBoard();
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
//    assertEquals("Game quit!\n" +
//            "State of game when quit:\n" +
//            "    O O O \n" +
//            "    O O O \n" +
//            "O O O O O O O\n" +
//            "O O O _ O O O\n" +
//            "O O O O O O O\n" +
//            "    O O O \n" +
//            "    O O O \n" +
//            "Score: 32", output.toString());
  }

  @Test
  public void testValue() {
    EnglishSolitaireModel englishSolitaireModel = new EnglishSolitaireModel();
    StringWriter output = new StringWriter();
    MarbleSolitaireTextView marbleSolitaireTextView = new MarbleSolitaireTextView(englishSolitaireModel, output);
    StringReader input = new StringReader("");
    MarbleSolitaireControllerImpl marbleSolitaireControllerImpl = new MarbleSolitaireControllerImpl(englishSolitaireModel, marbleSolitaireTextView, input);

    for (int i = 0; i < 100; i++) {
      input = new StringReader(Integer.toString(i));
      marbleSolitaireControllerImpl = new MarbleSolitaireControllerImpl(englishSolitaireModel, marbleSolitaireTextView, input);
      assertEquals(Integer.toString(i), marbleSolitaireControllerImpl.value());
      assertEquals(false, marbleSolitaireControllerImpl.isQuit());
    }

    for (int i = 100; i < 100; i++) {
      input = new StringReader(Integer.toString(-1 * i));
      marbleSolitaireControllerImpl = new MarbleSolitaireControllerImpl(englishSolitaireModel, marbleSolitaireTextView, input);
      assertEquals(Integer.toString(-1 * i), marbleSolitaireControllerImpl.value());
      assertEquals(false, marbleSolitaireControllerImpl.isQuit());
      assertEquals("Invalid input! Enter a positive integer or the letter \'q\' or \'Q\' to quit", output.toString());
    }

    input = new StringReader("q");
    marbleSolitaireControllerImpl = new MarbleSolitaireControllerImpl(englishSolitaireModel, marbleSolitaireTextView, input);
    marbleSolitaireControllerImpl.value();
    assertEquals(true, marbleSolitaireControllerImpl.isQuit());

    input = new StringReader("Q");
    marbleSolitaireControllerImpl = new MarbleSolitaireControllerImpl(englishSolitaireModel, marbleSolitaireTextView, input);
    marbleSolitaireControllerImpl.value();
    assertEquals(true, marbleSolitaireControllerImpl.isQuit());
  }
}