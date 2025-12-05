import caflib from "./caflib.ts"

const filePath = "./day5/data.txt"
const [ ranges, ids] = caflib.readIngredients( filePath )

console.time("Solution")
const freshIDs = caflib.checkFreshIDs( ids, ranges)
const uniqueRanges = caflib.parseUniqueRanges( ranges )
const totalIDs = caflib.totalFreshIDs( Array.from( uniqueRanges ) )
console.timeEnd("Solution")

console.log( freshIDs.length )
console.log( totalIDs )