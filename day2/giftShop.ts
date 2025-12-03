import idlib from "./idlib.ts"

const ranges = idlib.readRanges("./day2/data.txt")

console.time("Solution")
const [ invalidIDs, invalidRepeatingIDs] = idlib.filterInvalidIDs( ranges )

if( invalidIDs == undefined || invalidRepeatingIDs == undefined ) throw new Error("Invalid result")

const result = invalidIDs.reduce( ( sum, id) => sum + id, 0)
const resultPart2 = invalidRepeatingIDs.reduce( ( sum, id) => sum + id, 0)
console.timeEnd("Solution")

console.log( result )
console.log( resultPart2 )