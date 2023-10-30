import java.awt.*;

/**
 * Represents a cell
 */
public interface ICell {
  /**
   * To determine if the color of the cell is equal to the given color
   *
   * @param color the color being compared for equality
   * @return true if the cell's color is equal to the given color or false if not
   */
  public boolean equalColor(Color color);
}
