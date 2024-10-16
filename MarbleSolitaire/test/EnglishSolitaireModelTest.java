import org.junit.Test;

import java.util.Random;

import cs3500.marblesolitaire.model.hw02.EnglishSolitaireModel;
import cs3500.marblesolitaire.model.hw02.MarbleSolitaireModelState;
import cs3500.marblesolitaire.model.hw04.AbstractSolitaireModel;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

public class EnglishSolitaireModelTest {
  @Test
  public void testValidArmLength() {
    Random r = new Random(200);
    for (int i = 3; i < 100; i = i + 2) {
      int armThickness = i;


      AbstractSolitaireModel englishSolitaireModel = new EnglishSolitaireModel(armThickness);
      assertEquals("Attempted to create a valid EnglishSolitaireModel but did not succeed", englishSolitaireModel, englishSolitaireModel);
    }
  }


  @Test
  public void testInvalidEvenArmLength() {
    Random r = new Random(200);
    for (int i = 0; i < 100; i++) {
      int armThickness = r.nextInt();

      if (armThickness % 2 != 0) {
        armThickness = armThickness - 1;
      }

      AbstractSolitaireModel englishSolitaireModel;
      try {
        englishSolitaireModel = new EnglishSolitaireModel(armThickness);
        fail("Tried to create an invalid EnglishSolitaireModel and did not see an IllegalArgumentException!");
      } catch (IllegalArgumentException e) {
      }
    }
  }

  @Test
  public void testGetBoardSize() {
    Random r = new Random(200);
    for (int i = 3; i < 100; i = i + 2) {
      int armThickness = i;

      AbstractSolitaireModel englishSolitaireModel = new EnglishSolitaireModel(armThickness);
      assertEquals(((3 * i) - 2), englishSolitaireModel.getBoardSize());
    }
  }

  @Test
  public void getSlotAt() {
    AbstractSolitaireModel englishSolitaireModel = new EnglishSolitaireModel(3);
    assertEquals(MarbleSolitaireModelState.SlotState.Invalid, englishSolitaireModel.getSlotAt(0, 0));
    assertEquals(MarbleSolitaireModelState.SlotState.Invalid, englishSolitaireModel.getSlotAt(0, 6));
    assertEquals(MarbleSolitaireModelState.SlotState.Empty, englishSolitaireModel.getSlotAt(3, 3));
    assertEquals(MarbleSolitaireModelState.SlotState.Marble, englishSolitaireModel.getSlotAt(2, 0));
    assertEquals(MarbleSolitaireModelState.SlotState.Marble, englishSolitaireModel.getSlotAt(2, 6));
  }


  @Test
  public void testGetScore() {
    AbstractSolitaireModel englishSolitaireModel1 = new EnglishSolitaireModel(3);
    assertEquals(32, englishSolitaireModel1.getScore());

    AbstractSolitaireModel englishSolitaireModel2 = new EnglishSolitaireModel(5);
    assertEquals(104, englishSolitaireModel2.getScore());

    AbstractSolitaireModel englishSolitaireModel3 = new EnglishSolitaireModel(7);
    assertEquals(216, englishSolitaireModel3.getScore());

    AbstractSolitaireModel englishSolitaireModel4 = new EnglishSolitaireModel(9);
    assertEquals(368, englishSolitaireModel4.getScore());

    AbstractSolitaireModel englishSolitaireModel5 = new EnglishSolitaireModel(11);
    assertEquals(560, englishSolitaireModel5.getScore());
  }

  @Test
  public void testMove() {

    AbstractSolitaireModel englishSolitaireModel = new EnglishSolitaireModel();

    assertEquals(MarbleSolitaireModelState.SlotState.Empty, englishSolitaireModel.getSlotAt(3, 3));

    englishSolitaireModel.move(1, 3, 3, 3);
    assertEquals(MarbleSolitaireModelState.SlotState.Empty, englishSolitaireModel.getSlotAt(1, 3));
    assertEquals(MarbleSolitaireModelState.SlotState.Empty, englishSolitaireModel.getSlotAt(2, 3));
    assertEquals(MarbleSolitaireModelState.SlotState.Marble, englishSolitaireModel.getSlotAt(3, 3));

    englishSolitaireModel.move(2, 1, 2, 3);
    assertEquals(MarbleSolitaireModelState.SlotState.Empty, englishSolitaireModel.getSlotAt(2, 1));
    assertEquals(MarbleSolitaireModelState.SlotState.Empty, englishSolitaireModel.getSlotAt(2, 2));
    assertEquals(MarbleSolitaireModelState.SlotState.Marble, englishSolitaireModel.getSlotAt(2, 3));

    englishSolitaireModel = new EnglishSolitaireModel();
    englishSolitaireModel.move(5, 3, 3, 3);
    assertEquals(MarbleSolitaireModelState.SlotState.Empty, englishSolitaireModel.getSlotAt(5, 3));
    assertEquals(MarbleSolitaireModelState.SlotState.Marble, englishSolitaireModel.getSlotAt(3, 3));
  }

  @Test
  public void testGameOver() {

    AbstractSolitaireModel englishSolitaireModel = new EnglishSolitaireModel();
    assertEquals(false, englishSolitaireModel.isGameOver());
    englishSolitaireModel.move(3, 5, 3, 3);
    englishSolitaireModel.move(3, 2, 3, 4);
    englishSolitaireModel.move(3, 0, 3, 2);
    englishSolitaireModel.move(5, 3, 3, 3);
    englishSolitaireModel.move(3, 3, 3, 1);
    englishSolitaireModel.move(5, 2, 3, 2);
    englishSolitaireModel.move(4, 0, 4, 2);
    englishSolitaireModel.move(2, 1, 4, 1);
    englishSolitaireModel.move(2, 3, 2, 1);
    englishSolitaireModel.move(2, 0, 2, 2);
    englishSolitaireModel.move(2, 5, 2, 3);
    assertEquals(false, englishSolitaireModel.isGameOver());
    englishSolitaireModel.move(4, 4, 2, 4);
    englishSolitaireModel.move(2, 3, 2, 5);
    englishSolitaireModel.move(0, 4, 2, 4);
    englishSolitaireModel.move(0, 2, 0, 4);
    englishSolitaireModel.move(4, 6, 4, 4);
    englishSolitaireModel.move(2, 6, 4, 6);
    englishSolitaireModel.move(3, 2, 5, 2);
    englishSolitaireModel.move(1, 2, 3, 2);
    assertEquals(false, englishSolitaireModel.isGameOver());
    englishSolitaireModel.move(6, 2, 4, 2);
    englishSolitaireModel.move(3, 2, 5, 2);
    englishSolitaireModel.move(6, 4, 6, 2);
    englishSolitaireModel.move(6, 2, 4, 2);
    englishSolitaireModel.move(4, 1, 4, 3);
    englishSolitaireModel.move(4, 3, 4, 5);
    englishSolitaireModel.move(4, 6, 4, 4);
    englishSolitaireModel.move(5, 4, 3, 4);
    englishSolitaireModel.move(3, 4, 1, 4);
    englishSolitaireModel.move(0, 4, 2, 4);
    englishSolitaireModel.move(2, 5, 2, 3);
    englishSolitaireModel.move(1, 3, 3, 3);
    assertEquals(true, englishSolitaireModel.isGameOver());

  }

  @Test
  public void testTwoPoint() {
    AbstractSolitaireModel englishSolitaireModel = new EnglishSolitaireModel(3);
    assertEquals(false, englishSolitaireModel.twoPoint(1, 3, 0, 1));
    assertEquals(false, englishSolitaireModel.twoPoint(1, 3, 4, 5));
    assertEquals(false, englishSolitaireModel.twoPoint(1, 3, 100, 12));
    assertEquals(false, englishSolitaireModel.twoPoint(1, 3, 5, 3));
    assertEquals(true, englishSolitaireModel.twoPoint(1, 3, 3, 3));
    assertEquals(true, englishSolitaireModel.twoPoint(5, 3, 3, 3));
    assertEquals(true, englishSolitaireModel.twoPoint(3, 1, 3, 3));
    assertEquals(true, englishSolitaireModel.twoPoint(3, 5, 3, 3));
  }

  @Test
  public void testInRange() {
    AbstractSolitaireModel englishSolitaireModel = new EnglishSolitaireModel(3);
    assertEquals(false, englishSolitaireModel.inRange(0, 0));
    assertEquals(false, englishSolitaireModel.inRange(0, 6));
    assertEquals(false, englishSolitaireModel.inRange(6, 0));
    assertEquals(false, englishSolitaireModel.inRange(6, 6));
    assertEquals(true, englishSolitaireModel.inRange(3, 3));
    assertEquals(true, englishSolitaireModel.inRange(0, 2));
    assertEquals(true, englishSolitaireModel.inRange(2, 2));
    assertEquals(true, englishSolitaireModel.inRange(3, 4));
    assertEquals(true, englishSolitaireModel.inRange(3, 1));
  }

  @Test
  public void testMoveHelp() {

    AbstractSolitaireModel englishSolitaireModel = new EnglishSolitaireModel();

    assertEquals(MarbleSolitaireModelState.SlotState.Empty, englishSolitaireModel.getSlotAt(3, 3));

    englishSolitaireModel.moveHelp(1, 3, 3, 3);
    assertEquals(MarbleSolitaireModelState.SlotState.Empty, englishSolitaireModel.getSlotAt(1, 3));
    assertEquals(MarbleSolitaireModelState.SlotState.Empty, englishSolitaireModel.getSlotAt(2, 3));
    assertEquals(MarbleSolitaireModelState.SlotState.Marble, englishSolitaireModel.getSlotAt(3, 3));

    englishSolitaireModel.moveHelp(2, 1, 2, 3);
    assertEquals(MarbleSolitaireModelState.SlotState.Empty, englishSolitaireModel.getSlotAt(2, 1));
    assertEquals(MarbleSolitaireModelState.SlotState.Empty, englishSolitaireModel.getSlotAt(2, 2));
    assertEquals(MarbleSolitaireModelState.SlotState.Marble, englishSolitaireModel.getSlotAt(2, 3));
  }

  @Test
  public void testValidMove() {
    AbstractSolitaireModel englishSolitaireModel = new EnglishSolitaireModel(3);
    assertEquals(false, englishSolitaireModel.validMove(0, 0, 0, 0));
    assertEquals(false, englishSolitaireModel.validMove(0, 0, 3, 2));
    assertEquals(false, englishSolitaireModel.validMove(2, 1, 4, 1));
    assertEquals(true, englishSolitaireModel.validMove(5, 3, 3, 3));
    assertEquals(true, englishSolitaireModel.validMove(1, 3, 3, 3));
    assertEquals(true, englishSolitaireModel.validMove(3, 1, 3, 3));
    assertEquals(true, englishSolitaireModel.validMove(3, 5, 3, 3));
  }
}