import { Timer } from "../utils/timer.ts"
const timer = new Timer();
timer.start();

import nt from "../utils/numty.ts"
import jlib from "./jlib.ts"

const filePath = "./day8/data.txt"
const data = nt.readmatrix( filePath, ",")
const nConnections = 1000

var junctionBoxes = jlib.parseJunctionBoxes( data )
var boxDistances = jlib.computeDistances( junctionBoxes )

const __ = jlib.connect( boxDistances, junctionBoxes, nConnections)
const circuitsPart1 = jlib.getCircuits( junctionBoxes )
const finalJunctionBoxes = jlib.connect( boxDistances, junctionBoxes, Infinity, nConnections)

const resultPart1 = jlib.parseResultPart1( circuitsPart1, 3)
const resultPart2 = jlib.parseResultPart2( finalJunctionBoxes )

timer.print()

console.log( resultPart1 )
console.log( resultPart2 )