import safelib from "./Safe.ts";

const filePath = "./day1/data.txt"
const initialState = 50

var safe = new safelib.Safe( initialState );
var protocalSafe = new safelib.Safe( initialState );

const rotations = safelib.readRotations( filePath, safe);
const protocalRotations = safelib.readProtocalRotations( filePath );

rotations.forEach( rotation => {
    safe.rotate( rotation );
});

protocalRotations.forEach( rotation => {
    protocalSafe.rotate( rotation );
});

const password = safe.countStates( 0 )
const protocalPassword = protocalSafe.countStates( 0 )

console.log("Password: ", password)
console.log("Password (new security protocal): ", protocalPassword)