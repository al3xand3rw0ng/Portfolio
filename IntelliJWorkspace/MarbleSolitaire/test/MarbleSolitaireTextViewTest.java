import junit.framework.TestCase;

import cs3500.marblesolitaire.model.hw02.EnglishSolitaireModel;
import cs3500.marblesolitaire.model.hw04.EuropeanSolitaireModel;
import cs3500.marblesolitaire.view.MarbleSolitaireTextView;

public class MarbleSolitaireTextViewTest extends TestCase {

  public void testNull() {
    try {
      MarbleSolitaireTextView marbleSolitaireTextView = new MarbleSolitaireTextView(null);
      fail("Tried to create a MarbleSolitaireTextView with a null english solitaire model and did not see an IllegalArgumentException!");
    } catch (IllegalArgumentException e) {
    }
  }

  public void testToString() {
    EnglishSolitaireModel englishSolitaireModel1 = new EnglishSolitaireModel();
    MarbleSolitaireTextView marbleSolitaireTextView1 = new MarbleSolitaireTextView(englishSolitaireModel1);

    EnglishSolitaireModel englishSolitaireModel2 = new EnglishSolitaireModel(5);
    MarbleSolitaireTextView marbleSolitaireTextView2 = new MarbleSolitaireTextView(englishSolitaireModel2);

    EuropeanSolitaireModel europeanSolitaireModel1 = new EuropeanSolitaireModel();
    MarbleSolitaireTextView marbleSolitaireTextView3 = new MarbleSolitaireTextView(europeanSolitaireModel1);

    EuropeanSolitaireModel europeanSolitaireModel2 = new EuropeanSolitaireModel(5);
    MarbleSolitaireTextView marbleSolitaireTextView4 = new MarbleSolitaireTextView(europeanSolitaireModel2);

    assertEquals("    O O O \n" +
            "    O O O \n" +
            "O O O O O O O\n" +
            "O O O _ O O O\n" +
            "O O O O O O O\n" +
            "    O O O \n" +
            "    O O O \n", marbleSolitaireTextView1.toString());

    assertEquals("        O O O O O \n" +
            "        O O O O O \n" +
            "        O O O O O \n" +
            "        O O O O O \n" +
            "O O O O O O O O O O O O O\n" +
            "O O O O O O O O O O O O O\n" +
            "O O O O O O _ O O O O O O\n" +
            "O O O O O O O O O O O O O\n" +
            "O O O O O O O O O O O O O\n" +
            "        O O O O O \n" +
            "        O O O O O \n" +
            "        O O O O O \n" +
            "        O O O O O \n", marbleSolitaireTextView2.toString());

    assertEquals("    O O O \n" +
            "  O O O O O \n" +
            "O O O O O O O\n" +
            "O O O _ O O O\n" +
            "O O O O O O O\n" +
            "  O O O O O \n" +
            "    O O O \n", marbleSolitaireTextView3.toString());

    assertEquals("        O O O O O \n" +
            "      O O O O O O O \n" +
            "    O O O O O O O O O \n" +
            "  O O O O O O O O O O O \n" +
            "O O O O O O O O O O O O O\n" +
            "O O O O O O O O O O O O O\n" +
            "O O O O O O _ O O O O O O\n" +
            "O O O O O O O O O O O O O\n" +
            "O O O O O O O O O O O O O\n" +
            "  O O O O O O O O O O O \n" +
            "    O O O O O O O O O \n" +
            "      O O O O O O O \n" +
            "        O O O O O \n", marbleSolitaireTextView4.toString());
  }
}

