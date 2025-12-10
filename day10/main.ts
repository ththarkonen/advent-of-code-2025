import { Timer } from "../utils/timer.ts"
const timer = new Timer();
timer.start();

import lib from "./lightlib.ts"

const filePath = "./day10/data.txt"
var diagrams = lib.parseData( filePath )

const lightsSteps = lib.toggleLights( diagrams )
const joltageSteps = lib.toggleJoltages( diagrams )

timer.print()
console.log( lightsSteps )
console.log( joltageSteps )