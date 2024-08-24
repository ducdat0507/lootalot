/**
 * Inverse error function
 */
export declare function erf_inv(x: number): number;
/**
 * Probit function, or normal distribution quantile function if `μ` and `σ` is set
 */
export declare function probit(p: number, μ?: number, σ?: number): number;
/**
 * Flip `n` weighted coins, with `p` chance of landing on heads, and returns the number of heads.
 * @argument {number} p - Probabilty of landing on heads.
 * @argument {number} n - Amount of coins to flip.
 */
export declare function coin_flip(n: number, p: number): number;
/**
 * Roll `n` dice, with face values ranging from `min` to `max`, and returns the sum of the roll dice's face values.
 * @argument {number} min - The minimum dice value. (inclusive)
 * @argument {number} max - The minimum dice value. (inclusive)
 * @argument {number} n - Amount of dice to roll.
 */
export declare function dice_roll(n: number, min: number, max: number): number;
