import { Timer } from "../utils/timer.ts"
const timer = new Timer();
timer.start();

import lib from "./reactorlib.ts"

const filePath = "./day11/data.txt"
const network = lib.parseNetwork( filePath )
const total_you2out = lib.findPaths( network, "you", "out")

// The first branch is redundant
const svr2dac = lib.findPaths( network, "svr", "dac")
const dac2fft = lib.findPaths( network, "dac", "fft")
const fft2out = lib.findPaths( network, "fft", "out")

const svr2fft = lib.findPaths( network, "svr", "fft")
const fft2dac = lib.findPaths( network, "fft", "dac")
const dac2out = lib.findPaths( network, "dac", "out")

const total_svr2out = svr2dac * dac2fft * fft2out + svr2fft * fft2dac * dac2out

timer.print()
console.log( total_you2out )
console.log( total_svr2out )