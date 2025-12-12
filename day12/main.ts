import { Timer } from "../utils/timer.ts"
const timer = new Timer();
timer.start();

import lib from "./sadlib.ts"
const filePath = "./day12/data.txt"
const result = lib.sad( filePath )

timer.print()
console.log( )
console.log( result )