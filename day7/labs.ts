import nt from "../utils/numty.ts"
import type { Encoder } from "../utils/numty.ts"
import beamlib from "./beamlib.ts"

var encoder: Encoder = {}
encoder["S"] = 1
encoder["."] = 0
encoder["^"] = -1

const filePath = "./day7/data.txt"
const diagram = nt.readmatrix( filePath, "", encoder)

console.time("Solution")
const splits = beamlib.simulate( diagram )
console.timeEnd("Solution")

const endStates = diagram.rows[ diagram.nRows - 1 ]
const totalTimelines = endStates?.reduce( ( a, b) => {
    if( a === undefined || b === undefined ) throw new Error("Undefined end state.")
    return a + b
})

console.log( splits )
console.log( totalTimelines )