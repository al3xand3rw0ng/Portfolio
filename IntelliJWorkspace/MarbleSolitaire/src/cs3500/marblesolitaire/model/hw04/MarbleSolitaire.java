package cs3500.marblesolitaire.model.hw04;

import java.io.InputStreamReader;
import java.util.Scanner;

import cs3500.marblesolitaire.controller.MarbleSolitaireControllerImpl;
import cs3500.marblesolitaire.model.hw02.EnglishSolitaireModel;
import cs3500.marblesolitaire.view.MarbleSolitaireTextView;

public final class MarbleSolitaire {
  public static void main(String[] args) {
    System.out.println("Enter \"english\", \"european\", or \"triangular\" to play a game!");
    Scanner s = new Scanner(System.in);

    while (s.hasNext()) {
      String in = s.next();
      try {
        switch (in) {
          case "english":
            EnglishSolitaireModel englishSolitaireModel = new EnglishSolitaireModel();
            Appendable ap1 = System.out;
            MarbleSolitaireTextView marbleSolitaireTextView1 = new MarbleSolitaireTextView(englishSolitaireModel, ap1);
            Readable rd1 = new InputStreamReader(System.in);

            MarbleSolitaireControllerImpl marbleSolitaireController1 = new MarbleSolitaireControllerImpl(
                    englishSolitaireModel,
                    marbleSolitaireTextView1,
                    rd1);

            marbleSolitaireController1.playGame();
          case "european":
            EuropeanSolitaireModel europeanSolitaireModel = new EuropeanSolitaireModel();
            Appendable ap2 = System.out;
            MarbleSolitaireTextView marbleSolitaireTextView2 = new MarbleSolitaireTextView(europeanSolitaireModel, ap2);
            Readable rd2 = new InputStreamReader(System.in);

            MarbleSolitaireControllerImpl marbleSolitaireController2 = new MarbleSolitaireControllerImpl(
                    europeanSolitaireModel,
                    marbleSolitaireTextView2,
                    rd2);

            marbleSolitaireController2.playGame();
          case "triangular":
            TriangleSolitaireModel triangleSolitaireModel = new TriangleSolitaireModel();
            Appendable ap3 = System.out;
            MarbleSolitaireTextView marbleSolitaireTextView3 = null;
            Readable rd3 = new InputStreamReader(System.in);

            MarbleSolitaireControllerImpl marbleSolitaireController3 = new MarbleSolitaireControllerImpl(
                    triangleSolitaireModel,
                    marbleSolitaireTextView3,
                    rd3);
          default:
            System.out.println("Invalid input! Enter \"english\", \"european\", or \"triangular\"");
        }
      } catch (Exception e) {
      }
    }
  }
}