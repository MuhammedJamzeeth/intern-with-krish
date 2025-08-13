package org.distance;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class GuessValue {
    private final Map<String, Integer> valueIndexMap = new HashMap<>();
    private final int alphabetSize;
    private final String target;

    public enum GuessResult {
        ICE("Ice! You're very far from the target."),
        COLD("Cold! You're a bit far off."),
        WARM("Warm! You're getting there."),
        HOT("Hot! You're very close."),
        MATCH("Congratulations! You guessed the correct value."),
        NONE("No valid guess made.");

        private final String message;

        GuessResult(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }

    public GuessValue(String[] guessValues) throws IOException {
        this.alphabetSize = guessValues.length;
        this.target = ConfigLoader.getTargetValue();

        // To avoid repeatedly converting the array to list
        for (int i = 0; i < guessValues.length; i++) {
            this.valueIndexMap.put(guessValues[i].toLowerCase(), i);
        }

    }

    public GuessResult findHowClose(String guess) throws IOException {
        if (target == null || target.isEmpty()) return GuessResult.NONE;
        if (guess == null || guess.isEmpty()) return GuessResult.NONE;

        int indexOfGuess = valueIndexMap.get(guess);
        int indexOfTarget = valueIndexMap.get(target.toLowerCase());

        int distance = Math.abs(indexOfGuess - indexOfTarget);
        double fraction = (double) (distance) / (alphabetSize);

        if (fraction == 0) return GuessResult.MATCH;
        if (fraction < 0.25) return GuessResult.HOT;
        if (fraction < 0.5) return GuessResult.WARM;
        if (fraction < 0.75) return GuessResult.COLD;

        return GuessResult.ICE;

    }

}
