import { Timer } from "../utils/timer.ts"
const timer = new Timer();
timer.start();

import nt from "../utils/numty.ts"
import tilelib from "./tilelib.ts"
import { BoundingBox } from "./tilelib.ts";

const filePath = "./day9/data.txt"
const data = nt.readmatrix( filePath, ",")

const tiles = tilelib.parseTiles( data )
var rectangles = tilelib.createRectangles( tiles )

const largestRectangle = rectangles[0]
if( largestRectangle === undefined ) throw new Error("Undefined result.")

const box = new BoundingBox( tiles )
const largestContainedRectangle = tilelib.findLargestRectangle( rectangles, box)

timer.print()

console.log( largestRectangle.area )
console.log( largestContainedRectangle.area )
