import java.awt.*;

// Represents an empty cell
public class EmptyCell implements ICell {
  /**
   * To determine if the color of this empty cell is equal to the given color
   *
   * @param color the color being compared for equality
   * @return false because an empty cell has no color
   */
  @Override
  public boolean equalColor(Color color) {
    return false;
  }
}
