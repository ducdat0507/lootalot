import { prefs } from "./index";

/**
 * Inverse error function 
 */
export function erf_inv(x: number): number {
    const a = 0.1400122886866665;
    const b = Math.log(1 - x ** 2) / a;
    const c = 2 / Math.PI / a + Math.log(1 - x ** 2) / 2;
    return Math.sign(x) * Math.sqrt(Math.sqrt(c ** 2 - b) - c);
}

/**
 * Probit function, or normal distribution quantile function if `μ` and `σ` is set
 */
export function probit(p: number, μ: number = 0, σ: number = 1): number {
    const sqrt2 = 1.4142135623730951
    return erf_inv(2 * p - 1) * sqrt2 * σ + μ;
}

/**
 * Flip `n` weighted coins, with `p` chance of landing on heads, and returns the number of heads.
 * @argument {number} p - Probabilty of landing on heads.
 * @argument {number} n - Amount of coins to flip.
 */
export function coin_flip(n: number, p: number) {
    if (p <= 0) return 0;
    if (p >= 1) return n;
    if (n <= prefs.MAX_REPEAT) {
        let successes = 0;
        for (let i = 0; i < n; i++) successes += +(Math.random() < p);
        return successes;
    } else {
        let μ = n * p;
        let σ = Math.sqrt(μ * (1 - p));
        return Math.round(clamp(probit(Math.random(), μ, σ), 0, n));
    }
}

/**
 * Roll `n` dice, with face values ranging from `min` to `max`, and returns the sum of the roll dice's face values.
 * @argument {number} min - The minimum dice value. (inclusive)
 * @argument {number} max - The minimum dice value. (inclusive)
 * @argument {number} n - Amount of dice to roll.
 */
export function dice_roll(n: number, min: number, max: number) {
    if (min == max) return min * n;
    if (n <= prefs.MAX_REPEAT) {
        let value = 0;
        for (let i = 0; i < n; i++) value += Math.floor(Math.random() * (max - min + 1) + min);
        return value;
    } else {
        let μ = (max + min) / 2 * n;
        let σ = Math.sqrt(((max - min) ** 2 - 1) / 12 * n);
        return Math.round(clamp(probit(Math.random(), μ, σ), min * n, max * n));
    }
}

function clamp(x: number, min: number, max: number) {
    return Math.max(Math.min(x, max), min);
}