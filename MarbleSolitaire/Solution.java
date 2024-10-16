import java.util.Arrays;

import java.util.List;

import java.util.Optional;


public class Solution {

  public static void main(String[] args) {

    List<String> words = Arrays.asList("hello", "world", "stream");


    Optional<String> joinedString = words.stream()

            .reduce((acc, word) ->

                    acc.isEmpty() ? word : acc + "," + word

            );


    if (joinedString.isPresent()) {

      System.out.println(joinedString.get()); // Output: hello,world,stream

    }

  }

}