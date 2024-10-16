/**
 * Play this game of FloodIt
 */
public class PlayGame {
  /**
   * Play a game using a screen size of 700 x 700 and a tick speed of 1
   */
  public static void main(String[] args) {
    FloodItWorld floodItWorld = new FloodItWorld(5, 6);
    floodItWorld.bigBang(700, 700, 1);
  }
}