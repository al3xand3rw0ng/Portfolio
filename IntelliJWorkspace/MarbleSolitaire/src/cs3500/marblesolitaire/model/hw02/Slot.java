package cs3500.marblesolitaire.model.hw02;

import cs3500.marblesolitaire.model.hw02.MarbleSolitaireModelState.SlotState;

// Represents a single square of the game area
public class Slot {
  protected SlotState slotStatus;

  //constructor
  public Slot(SlotState slotStatus) {
    this.slotStatus = slotStatus;
  }

  /**
   * Get the state of this slot
   *
   * @return the slot status of the cell as a MarbleSolitaireModelState.SlotState
   */
  public MarbleSolitaireModelState.SlotState getSlotStatus() {
    return this.slotStatus;
  }

  /**
   * Get the state of this slot to the given MarbleSolitaireModelState.SlotState
   *
   * @param slotStatus the MarbleSolitaireModelState.SlotState to change this cell's slotStatus to
   */
  public void setSlotStatus(MarbleSolitaireModelState.SlotState slotStatus) {
    this.slotStatus = slotStatus;
  }

  /**
   * Determine if two cells are equal
   *
   * @param o the given object
   * @return a boolean of true if the cells are equal and false if not equal
   */
  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }

    if (!(o instanceof Slot)) {
      return false;
    }

    Slot that = (Slot) o;

    return this.slotStatus == that.slotStatus;
  }
}
