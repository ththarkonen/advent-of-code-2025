import { Timer } from "../utils/timer.ts"
const timer = new Timer();
timer.start();

import nt from "../utils/numty.ts"
import joltlib from "./joltlib.ts"

const filePath = "./day3/data.txt"
const banks = nt.readmatrix( filePath, "")

var joltages: number[] = []
var largeJoltages: number[] = []

banks.rows.forEach( bank => {

    const joltage = joltlib.checkJoltage( bank, 2)
    const largeJoltage = joltlib.checkJoltage( bank, 12)

    joltages.push( joltage )
    largeJoltages.push( largeJoltage )
});

const totalOutput = joltages.reduce( ( sum, jolt) => sum + jolt)
const totalOutputLarge = largeJoltages.reduce( ( sum, jolt) => sum + jolt)

timer.print()
console.log( totalOutput )
console.log( totalOutputLarge )