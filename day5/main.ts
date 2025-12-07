import { Timer } from "../utils/timer.ts"
const timer = new Timer();
timer.start();

import caflib from "./caflib.ts"

const filePath = "./day5/data.txt"
const [ ranges, ids] = caflib.readIngredients( filePath )

const freshIDs = caflib.checkFreshIDs( ids, ranges)
const uniqueRanges = caflib.parseUniqueRanges( ranges )
const totalIDs = caflib.totalFreshIDs( Array.from( uniqueRanges ) )

timer.print()
console.log( freshIDs.length )
console.log( totalIDs )