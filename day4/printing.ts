import nt from "../utils/numty.ts"
import type { Encoder } from "../utils/numty.ts"

import rolllib from "./rolllib.ts"

var encoder: Encoder = {}
encoder["."] = 0
encoder["@"] = 1

const filePath = "./day4/data.txt"
const rollMap = nt.readmatrix( filePath, "", encoder)

console.time("Solution")
const [ removedRolls, totalRemoved] = rolllib.removeRolls( rollMap, 4)
console.timeEnd("Solution")

const nSteps = removedRolls.length
console.log( totalRemoved[0] )
console.log( totalRemoved[ nSteps - 1 ] )