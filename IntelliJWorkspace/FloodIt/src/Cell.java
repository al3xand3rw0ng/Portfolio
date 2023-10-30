import java.awt.*;

import javalib.worldimages.OutlineMode;
import javalib.worldimages.RectangleImage;

/**
 * Represents a single square of the game area
 */
public class Cell implements ICell {
  // In logical coordinates, with the origin in the top left corner of the screen
  private int x;
  private int y;
  // The color of this cell
  private Color color;
  // Is this cell flooded?
  private boolean flooded;
  // The four adjacent cells to this one
  private ICell left;
  private ICell top;
  private ICell right;
  private ICell bottom;

  /**
   * Constructs this cell
   *
   * @param x       the x coordinate of this cell
   * @param y       the y coordinate of this cell
   * @param color   the color of this cell
   * @param flooded is this cell flooded?
   */
  public Cell(int x, int y, Color color, boolean flooded) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.flooded = flooded;
    this.left = new EmptyCell();
    this.top = new EmptyCell();
    this.right = new EmptyCell();
    this.bottom = new EmptyCell();
  }

  public int getX() {
    return this.x;
  }

  public int getY() {
    return this.y;
  }

  public Color getColor() {
    return this.color;
  }

  public boolean getFlooded() {
    return this.flooded;
  }

  public ICell getLeft() {
    return this.left;
  }

  public ICell getTop() {
    return this.top;
  }

  public ICell getRight() {
    return this.right;
  }

  public ICell getBottom() {
    return this.bottom;
  }

  public void setX(int x) {
    this.x = x;
  }

  public void setY(int y) {
    this.y = y;
  }

  public void setColor(Color color) {
    this.color = color;
  }

  public void setFlooded(Boolean flooded) {
    this.flooded = flooded;
  }

  public void setLeft(Cell cell) {
    this.left = cell;
  }

  public void setTop(Cell cell) {
    this.top = cell;
  }

  public void setRight(Cell cell) {
    this.right = cell;
  }

  public void setBottom(Cell cell) {
    this.bottom = cell;
  }

  /**
   * Draw this cell
   *
   * @param cellSize the size to draw the cell
   * @return a rectangle image of this cell using this cell's color and the given cell size
   */
  public RectangleImage drawCell(int cellSize) {
    return new RectangleImage(cellSize, cellSize, OutlineMode.SOLID, this.color);
  }

  /**
   * To determine if the color of this cell is equal to the given color
   *
   * @param color the color being compared for equality
   * @return true if this cell's color is equal to the given color or false if not
   */
  @Override
  public boolean equalColor(Color color) {
    return this.color.equals(color);
  }
}