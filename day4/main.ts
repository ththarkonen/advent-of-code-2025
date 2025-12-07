import { Timer } from "../utils/timer.ts"
const timer = new Timer();
timer.start();

import nt from "../utils/numty.ts"
import type { Encoder } from "../utils/numty.ts"

import rolllib from "./rolllib.ts"

var encoder: Encoder = {}
encoder["."] = 0
encoder["@"] = 1

const filePath = "./day4/data.txt"
const rollMap = nt.readmatrix( filePath, "", encoder)

const [ removedRolls, totalRemoved] = rolllib.removeRolls( rollMap, 4)

timer.print()
console.log( totalRemoved[0] )
console.log( totalRemoved[ removedRolls.length - 1 ] )