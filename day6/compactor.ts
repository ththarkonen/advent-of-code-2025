import fs from "fs"
import nt from "../utils/numty.ts"
import type { Encoder } from "../utils/numty.ts"
import comlib from "./comlib.ts"

var encoder: Encoder = {}
encoder["*"] = 0
encoder["+"] = 1

const dataFilePath = "./day6/data.txt"
const opFilePath = "./day6/dataop.txt"

const data = nt.readmatrix( dataFilePath, " ")
var operations = fs.readFileSync( opFilePath, "utf-8").split(" ").filter( line => line.length > 0 );

var cephalopodData = comlib.parseSpacedData( dataFilePath, opFilePath)
const cephalopodColumnsR2L = comlib.parseCephalopodColumns( cephalopodData )

const result = comlib.performOperations( operations, data.cols as number[][])
const resultR2L = comlib.performOperations( operations, cephalopodColumnsR2L as number[][])

console.log( result )
console.log( resultR2L )