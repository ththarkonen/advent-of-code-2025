import nt from "../utils/numty.ts"
import joltlib from "./joltlib.ts"

const filePath = "./day3/data.txt"
const banks = nt.readmatrix( filePath, "")

var joltages: number[] = []
var largeJoltages: number[] = []

console.time("Solution")
banks.rows.forEach( bank => {

    const joltage = joltlib.checkJoltage( bank, 2)
    const largeJoltage = joltlib.checkJoltage( bank, 12)

    joltages.push( joltage )
    largeJoltages.push( largeJoltage )
});
console.timeEnd("Solution")

const totalOutput = joltages.reduce( ( sum, jolt) => sum + jolt)
const totalOutputLarge = largeJoltages.reduce( ( sum, jolt) => sum + jolt)

console.log( totalOutput )
console.log( totalOutputLarge )