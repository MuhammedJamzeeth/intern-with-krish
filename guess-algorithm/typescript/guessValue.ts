
const target = "k";
const map = new Map<string, number>();
const GuessResult = {
  ICE: "Ice! You're very far from the target.",
  COLD: "Cold! You're a bit far off.",
  WARM: "Warm! You're getting there.",
  HOT: "Hot! You're very close.",
  MATCH: "Congratulations! You guessed the correct value.",
  NONE: "No valid guess made.",
} as const;

type GuessResult = keyof typeof GuessResult;

function guessValue(guessValues: string[], guess: string): GuessResult {
    const size = guessValues.length;
    if(!target || size === 0 || !guess) {
        return "NONE";
    }
    for (let i = 0; i < guessValues.length; i++) {
        const value = guessValues[i];
        if (!map.has(value)) {
            map.set(value, i);
        }
    }

    if (!map.has(guess)) {
        return "NONE";
    }
    
    const distance = (map.get(target) || 0) - (map.get(guess) || 0);
    const fraction = Math.abs(distance) / size;

    if (fraction === 0) return "MATCH";
    if (fraction < 0.25) return "HOT";
    if (fraction < 0.5) return "WARM";
    if (fraction < 0.75) return "COLD";

    return "ICE";

}


const guessValues = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "s", "t", "u", "v", "w", "x", "y", "z"];
const result: GuessResult = guessValue(guessValues, "g");
console.log(GuessResult[result])
