import junit.framework.TestCase;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Random;

import cs3500.marblesolitaire.model.hw02.*;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

public class SlotTest extends TestCase {
  ArrayList<MarbleSolitaireModelState.SlotState> states = new ArrayList<MarbleSolitaireModelState.SlotState>();

  @Before
  public void initStatus() {
    states.add(MarbleSolitaireModelState.SlotState.Marble);
    states.add(MarbleSolitaireModelState.SlotState.Empty);
    states.add(MarbleSolitaireModelState.SlotState.Invalid);
  }

  @Test
  public void testGetSlotStatus() {
    initStatus();

    Random r = new Random(200);

    for (int i = 0; i < 100; i++) {
      int sRow = r.nextInt(20000) + 1;
      int sCol = r.nextInt(20000) + 1;
      int status = r.nextInt(3);

      Slot slot = new Slot(states.get(status));
      assertEquals(states.get(status), slot.getSlotStatus());
    }
  }

  @Test
  public void testSetSlotStatus() {
    initStatus();

    Random r = new Random(200);

    for (int i = 0; i < 100; i++) {
      int sRow = r.nextInt(20000) + 1;
      int sCol = r.nextInt(20000) + 1;
      int status = r.nextInt(3);
      int newStatus = r.nextInt(3);

      Slot slot = new Slot(states.get(status));
      assertEquals(states.get(status), slot.getSlotStatus());
      slot.setSlotStatus(states.get(newStatus));
      assertEquals(states.get(newStatus), slot.getSlotStatus());

    }
  }
}
