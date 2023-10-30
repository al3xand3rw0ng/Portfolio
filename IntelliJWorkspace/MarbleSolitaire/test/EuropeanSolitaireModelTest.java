import org.junit.Test;

import java.util.Random;

import cs3500.marblesolitaire.model.hw02.MarbleSolitaireModelState;

import cs3500.marblesolitaire.model.hw04.AbstractSolitaireModel;
import cs3500.marblesolitaire.model.hw04.EuropeanSolitaireModel;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

public class EuropeanSolitaireModelTest {
  @Test
  public void testValidArmLength() {
    Random r = new Random(200);
    for (int i = 3; i < 100; i = i + 2) {
      int armThickness = i;


      AbstractSolitaireModel europeanSolitaireModel = new EuropeanSolitaireModel(armThickness);
      assertEquals("Attempted to create a valid EuropeanSolitaireModel but did not succeed", europeanSolitaireModel, europeanSolitaireModel);
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

      AbstractSolitaireModel europeanSolitaireModel;
      try {
        europeanSolitaireModel = new EuropeanSolitaireModel(armThickness);
        fail("Tried to create an invalid EuropeanSolitaireModel and did not see an IllegalArgumentException!");
      } catch (IllegalArgumentException e) {
      }
    }
  }

  @Test
  public void testGetBoardSize() {
    Random r = new Random(200);
    for (int i = 3; i < 100; i = i + 2) {
      int armThickness = i;

      AbstractSolitaireModel europeanSolitaireModel = new EuropeanSolitaireModel(armThickness);
      assertEquals(((3 * i) - 2), europeanSolitaireModel.getBoardSize());
    }
  }

  @Test
  public void getSlotAt() {
    AbstractSolitaireModel europeanSolitaireModel = new EuropeanSolitaireModel(3);
    assertEquals(MarbleSolitaireModelState.SlotState.Invalid, europeanSolitaireModel.getSlotAt(0, 0));
    assertEquals(MarbleSolitaireModelState.SlotState.Invalid, europeanSolitaireModel.getSlotAt(1, 0));
    assertEquals(MarbleSolitaireModelState.SlotState.Invalid, europeanSolitaireModel.getSlotAt(0, 6));
    assertEquals(MarbleSolitaireModelState.SlotState.Empty, europeanSolitaireModel.getSlotAt(3, 3));
    assertEquals(MarbleSolitaireModelState.SlotState.Marble, europeanSolitaireModel.getSlotAt(1, 1));
    assertEquals(MarbleSolitaireModelState.SlotState.Marble, europeanSolitaireModel.getSlotAt(1, 5));
    assertEquals(MarbleSolitaireModelState.SlotState.Marble, europeanSolitaireModel.getSlotAt(5, 1));
    assertEquals(MarbleSolitaireModelState.SlotState.Marble, europeanSolitaireModel.getSlotAt(5, 5));
    assertEquals(MarbleSolitaireModelState.SlotState.Marble, europeanSolitaireModel.getSlotAt(2, 0));
    assertEquals(MarbleSolitaireModelState.SlotState.Marble, europeanSolitaireModel.getSlotAt(2, 6));
  }

  @Test
  public void testGetScore() {
    AbstractSolitaireModel europeanSolitaireModel1 = new EuropeanSolitaireModel(3);
    assertEquals(36, europeanSolitaireModel1.getScore());

    AbstractSolitaireModel europeanSolitaireModel2 = new EuropeanSolitaireModel(5);
    assertEquals(128, europeanSolitaireModel2.getScore());

    AbstractSolitaireModel europeanSolitaireModel3 = new EuropeanSolitaireModel(7);
    assertEquals(276, europeanSolitaireModel3.getScore());

    AbstractSolitaireModel europeanSolitaireModel4 = new EuropeanSolitaireModel(9);
    assertEquals(480, europeanSolitaireModel4.getScore());
  }

  @Test
  public void testMove() {
    AbstractSolitaireModel europeanSolitaireModel = new EuropeanSolitaireModel();

    assertEquals(MarbleSolitaireModelState.SlotState.Empty, europeanSolitaireModel.getSlotAt(3, 3));

    europeanSolitaireModel.move(1, 3, 3, 3);
    assertEquals(MarbleSolitaireModelState.SlotState.Empty, europeanSolitaireModel.getSlotAt(1, 3));
    assertEquals(MarbleSolitaireModelState.SlotState.Empty, europeanSolitaireModel.getSlotAt(2, 3));
    assertEquals(MarbleSolitaireModelState.SlotState.Marble, europeanSolitaireModel.getSlotAt(3, 3));

    europeanSolitaireModel.move(2, 1, 2, 3);
    assertEquals(MarbleSolitaireModelState.SlotState.Empty, europeanSolitaireModel.getSlotAt(2, 1));
    assertEquals(MarbleSolitaireModelState.SlotState.Empty, europeanSolitaireModel.getSlotAt(2, 2));
    assertEquals(MarbleSolitaireModelState.SlotState.Marble, europeanSolitaireModel.getSlotAt(2, 3));

    europeanSolitaireModel = new EuropeanSolitaireModel();
    europeanSolitaireModel.move(5, 3, 3, 3);
    assertEquals(MarbleSolitaireModelState.SlotState.Empty, europeanSolitaireModel.getSlotAt(5, 3));
    assertEquals(MarbleSolitaireModelState.SlotState.Marble, europeanSolitaireModel.getSlotAt(3, 3));
  }

  @Test
  public void testGameOver() {
    AbstractSolitaireModel europeanSolitaireModel = new EuropeanSolitaireModel(0, 2);
    assertEquals(false, europeanSolitaireModel.isGameOver());
    europeanSolitaireModel.move(0, 4, 0, 2);
    europeanSolitaireModel.move(2, 3, 0, 3);
    europeanSolitaireModel.move(0, 2, 0, 4);
    europeanSolitaireModel.move(1, 1, 1, 3);
    europeanSolitaireModel.move(1, 4, 1, 2);
    europeanSolitaireModel.move(2, 1, 2, 3);
    europeanSolitaireModel.move(2, 4, 2, 2);
    europeanSolitaireModel.move(2, 6, 2, 4);
    europeanSolitaireModel.move(3, 4, 1, 4);
    europeanSolitaireModel.move(0, 4, 2, 4);
    europeanSolitaireModel.move(3, 2, 3, 4);
    europeanSolitaireModel.move(1, 2, 3, 2);
    europeanSolitaireModel.move(3, 4, 1, 4);
    europeanSolitaireModel.move(1, 5, 1, 3);
    europeanSolitaireModel.move(3, 6, 3, 4);
    europeanSolitaireModel.move(4, 1, 2, 1);
    europeanSolitaireModel.move(2, 0, 2, 2);
    europeanSolitaireModel.move(3, 2, 1, 2);
    europeanSolitaireModel.move(1, 2, 1, 4);
    europeanSolitaireModel.move(4, 3, 4, 1);
    europeanSolitaireModel.move(4, 0, 4, 2);
    europeanSolitaireModel.move(4, 5, 4, 3);
    europeanSolitaireModel.move(4, 3, 4, 1);
    europeanSolitaireModel.move(5, 1, 3, 1);
    europeanSolitaireModel.move(3, 0, 3, 2);
    europeanSolitaireModel.move(6, 2, 4, 2);
    europeanSolitaireModel.move(3, 2, 5, 2);
    europeanSolitaireModel.move(6, 3, 4, 3);
    europeanSolitaireModel.move(5, 5, 5, 3);
    europeanSolitaireModel.move(5, 2, 5, 4);
    europeanSolitaireModel.move(6, 4, 4, 4);
    europeanSolitaireModel.move(4, 3, 4, 5);
    europeanSolitaireModel.move(4, 6, 4, 4);
    europeanSolitaireModel.move(4, 4, 2, 4);
    europeanSolitaireModel.move(2, 4, 0, 4);
    assertEquals(true, europeanSolitaireModel.isGameOver());
  }

  @Test
  public void testTwoPoint() {
    AbstractSolitaireModel europeanSolitaireModel = new EuropeanSolitaireModel(3);
    assertEquals(false, europeanSolitaireModel.twoPoint(1, 3, 0, 1));
    assertEquals(false, europeanSolitaireModel.twoPoint(1, 3, 4, 5));
    assertEquals(false, europeanSolitaireModel.twoPoint(1, 3, 100, 12));
    assertEquals(false, europeanSolitaireModel.twoPoint(1, 3, 5, 3));
    assertEquals(true, europeanSolitaireModel.twoPoint(1, 3, 3, 3));
    assertEquals(true, europeanSolitaireModel.twoPoint(5, 3, 3, 3));
    assertEquals(true, europeanSolitaireModel.twoPoint(3, 1, 3, 3));
    assertEquals(true, europeanSolitaireModel.twoPoint(3, 5, 3, 3));
  }

  @Test
  public void testInRange() {
    AbstractSolitaireModel europeanSolitaireModel = new EuropeanSolitaireModel(3);
    assertEquals(false, europeanSolitaireModel.inRange(0, 0));
    assertEquals(false, europeanSolitaireModel.inRange(0, 6));
    assertEquals(false, europeanSolitaireModel.inRange(6, 0));
    assertEquals(false, europeanSolitaireModel.inRange(6, 6));
    assertEquals(true, europeanSolitaireModel.inRange(3, 3));
    assertEquals(true, europeanSolitaireModel.inRange(0, 2));
    assertEquals(true, europeanSolitaireModel.inRange(2, 2));
    assertEquals(true, europeanSolitaireModel.inRange(3, 4));
    assertEquals(true, europeanSolitaireModel.inRange(3, 1));
    assertEquals(true, europeanSolitaireModel.inRange(1, 1));
    assertEquals(true, europeanSolitaireModel.inRange(1, 5));
    assertEquals(true, europeanSolitaireModel.inRange(5, 1));
    assertEquals(true, europeanSolitaireModel.inRange(5, 5));
  }

  @Test
  public void testMoveHelp() {
    AbstractSolitaireModel europeanSolitaireModel = new EuropeanSolitaireModel();

    assertEquals(MarbleSolitaireModelState.SlotState.Empty, europeanSolitaireModel.getSlotAt(3, 3));

    europeanSolitaireModel.moveHelp(1, 3, 3, 3);
    assertEquals(MarbleSolitaireModelState.SlotState.Empty, europeanSolitaireModel.getSlotAt(1, 3));
    assertEquals(MarbleSolitaireModelState.SlotState.Empty, europeanSolitaireModel.getSlotAt(2, 3));
    assertEquals(MarbleSolitaireModelState.SlotState.Marble, europeanSolitaireModel.getSlotAt(3, 3));

    europeanSolitaireModel.moveHelp(2, 1, 2, 3);
    assertEquals(MarbleSolitaireModelState.SlotState.Empty, europeanSolitaireModel.getSlotAt(2, 1));
    assertEquals(MarbleSolitaireModelState.SlotState.Empty, europeanSolitaireModel.getSlotAt(2, 2));
    assertEquals(MarbleSolitaireModelState.SlotState.Marble, europeanSolitaireModel.getSlotAt(2, 3));
  }

  @Test
  public void testValidMove() {
    AbstractSolitaireModel europeanSolitaireModel = new EuropeanSolitaireModel(3);
    assertEquals(false, europeanSolitaireModel.validMove(0, 0, 0, 0));
    assertEquals(false, europeanSolitaireModel.validMove(0, 0, 3, 2));
    assertEquals(false, europeanSolitaireModel.validMove(2, 1, 4, 1));
    assertEquals(true, europeanSolitaireModel.validMove(5, 3, 3, 3));
    assertEquals(true, europeanSolitaireModel.validMove(1, 3, 3, 3));
    assertEquals(true, europeanSolitaireModel.validMove(3, 1, 3, 3));
    assertEquals(true, europeanSolitaireModel.validMove(3, 5, 3, 3));
  }
}
