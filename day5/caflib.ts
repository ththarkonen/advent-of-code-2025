import fs from "fs"

const readIngredients = ( filePath: string ) : [ number[][], number[]] => {

    const data = fs.readFileSync( filePath, "utf-8");
    const lines = data.split("\n").filter( line => line.length > 0 );

    var ranges: number[][] = []
    var ids: number[] = []

    lines.forEach( line => {

        if( line.includes("-") ){

            const range: number[] = line.split("-").map( Number )
            ranges.push( range )

        } else {
            
            const id: number = Number( line )
            ids.push( id )
        }

    })

    return [ ranges, ids]
}

const checkFreshID = ( id: number, ranges: number[][]) : boolean => {

    for( var ii = 0; ii < ranges.length; ii++) {

        const range: number[] | undefined = ranges[ii]
        if( range === undefined ) continue

        const min: number = Math.min( ...range )
        const max: number = Math.max( ...range )

        const inRange: boolean = ( min <= id ) && ( id <= max )
        if( inRange ) return true
    }

    return false
}

const checkFreshIDs = ( ids: number[], ranges: number[][]) : number[] => {

    var freshIDs: number[] = []
    
    ids.forEach( id => {
        const fresh = checkFreshID( id, ranges)
        if( fresh ) freshIDs.push( id )
    })

    return freshIDs
}

const checkUniqueRange = ( range: number[], index: number, ranges: number[][]) : number[][] => {

    const nRanges = ranges.length
    const inputRangeMin = Math.min( ...range )
    const inputRangeMax = Math.max( ...range )

    for( var ii = 0; ii < nRanges; ii++){

        if( ii == index ) continue 

        const range_ii: number[] | undefined = ranges[ii]
        if( range_ii === undefined ) continue

        const min: number | undefined = range_ii[0]
        const max: number | undefined = range_ii[1]

        if( min === undefined || max === undefined ) continue
        if( max < min ){
            ranges.splice( ii, 1)
            return ranges
        }

        const minInRange: boolean = ( min <= inputRangeMin ) && ( inputRangeMin <= max )
        const maxInRange: boolean = ( min <= inputRangeMax ) && ( inputRangeMax <= max )

        if( !minInRange && !maxInRange ) continue

        if( minInRange && maxInRange ){
            ranges.splice( index, 1)
            return ranges
        }

        var newRange1: number[] | undefined = undefined
        var newRange2: number[] | undefined = undefined
        var newRange3: number[] | undefined = undefined

        if( maxInRange && inputRangeMax == max ){
            newRange1 = [ inputRangeMin, inputRangeMax]
        } else if ( maxInRange ){
            newRange1 = [ inputRangeMin, min - 1]
            newRange2 = [ min, inputRangeMax - 1]
            newRange3 = [ inputRangeMax, max]
        }

        if( minInRange && inputRangeMin == min ){
            newRange1 = [ inputRangeMin, inputRangeMax]
        } else if ( minInRange ){
            newRange1 = [ min, inputRangeMin - 1]
            newRange2 = [ inputRangeMin, max - 1]
            newRange3 = [ max, inputRangeMax]
        }

        ranges = ranges.filter( ( __, jj) => ( jj != index ) && ( jj != ii ) )

        if( newRange1 !== undefined ) ranges.push( newRange1 )
        if( newRange2 !== undefined ) ranges.push( newRange2 )
        if( newRange3 !== undefined ) ranges.push( newRange3 )

        return ranges
    }

    return ranges
}

const parseUniqueRanges = ( ranges: number[][] ) : number[][] => {

    var uniqueRanges: number[][] = structuredClone( ranges )
    var nUniqueRanges: number = 0

    while( true ){

        const nRanges: number = uniqueRanges.length

        for( var ii = 0; ii < nRanges; ii++){

            const rangeII: number[] | undefined = uniqueRanges[ii];
            if( rangeII === undefined ) continue

            uniqueRanges = checkUniqueRange( rangeII, ii, uniqueRanges)
            if( nRanges != uniqueRanges.length ) break
        }

        if( nUniqueRanges == uniqueRanges.length ) break
        nUniqueRanges = uniqueRanges.length
    }

    return uniqueRanges
}

const totalFreshIDs = ( ranges: number[][] ) : number => {

    var total: number = 0

    ranges.forEach( range => {

        const min: number = Math.min( ...range )
        const max: number = Math.max( ...range )

        total = total + max - min + 1
    })

    return total
}

export default { readIngredients, checkFreshIDs, totalFreshIDs, parseUniqueRanges}