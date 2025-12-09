import fs from "fs"
import nt from "../utils/numty.ts"

const readRanges = ( filePath: string ) => {

    const line = fs.readFileSync( filePath, "utf-8")
    const ranges: number[][] = line.split(",").map( ranges => ranges.split("-").map(Number) )

    return ranges
}

const checkID = ( id: number ) => {

    const idString = id.toString()
    
    var validID = idString.substring( 0, 1) != "0"
    if( !validID ) return false

    const l = idString.length
    const n = Math.ceil( 0.5 * l )
    const m = Math.floor( 0.5 * l )

    validID = idString.substring( 0, n) != idString.substring( l - m )

    if( !validID ) return false
    return true
}

const checkRepeatingID = ( id: number ) => {

    const idString = id.toString()
    
    var validID = idString.substring( 0, 1) != "0"
    if( !validID ) return false

    const l = idString.length
    const n = Math.floor( 0.5 * l )

    for( var ii = 1; ii <= n; ii++){

        const repeats = l / ii
        const integerRepeats = Number.isInteger( repeats )
        if( !integerRepeats ) continue

        const repeatingPart = idString.substring( 0, ii)
        const repeatComparison = repeatingPart.repeat( repeats )

        if( repeatComparison === idString ) return false
    }

    return true
}

const filterInvalidIDs = ( ranges: number[][] ) => {

    var invalidIDs: number[] = []
    var invalidRepeatingIDs: number[] = []

    ranges.forEach( range => {

        const startIndex = range[0]
        const endIndex = range[1]

        if( startIndex === undefined || endIndex === undefined ) throw new Error("Invalid range")

        const idRange = nt.range( startIndex, endIndex + 1)

        const currentInvalidIDs = idRange.filter( id => !checkID(id) )
        const currenInvalidRepeatingIDs = idRange.filter( id => !checkRepeatingID(id) )

        invalidIDs.push( ...currentInvalidIDs )
        invalidRepeatingIDs.push( ...currenInvalidRepeatingIDs )
    })

    return [ invalidIDs, invalidRepeatingIDs]
}

export default { readRanges, filterInvalidIDs}