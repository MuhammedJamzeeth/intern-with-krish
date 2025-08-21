package org.distance;

import java.io.IOException;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) throws IOException {
        String[] values = {"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"};
        GuessValue guessValue = new GuessValue(values);

        try (Scanner scanner = new Scanner(System.in); scanner) {
            System.out.println("Guess the letter or type 0 to exit:");
            while (true) {
                System.out.println("Enter your guess (a-z): ");
                String userGuess = scanner.nextLine().trim().toLowerCase();

                // Check for exit condition
                if (userGuess.equals("0")) {
                    System.out.println("Exiting the game.");
                    break;
                }

                GuessValue.GuessResult result = guessValue.findHowClose(userGuess);
                System.out.println(result.getMessage());
            }
        } catch (IOException e) {
            System.err.println("Error reading configuration: " + e.getMessage());
        }
    }
}