import { Matrix2D } from "../utils/numty.ts"

const splitBeam = ( ii: number, jj: number, diagram: Matrix2D) : [ number, number[]] => {

    const nStates = diagram.get( ii - 1, jj)
    const diagramValue = diagram.get( ii, jj)

    if( nStates === undefined ) throw new Error("Undefined value in the previous row.")
    if( typeof nStates !== "number" ) throw new Error("Number of states is not a number.")

    if( diagramValue === undefined ) throw new Error("Current diagram value is undefined.")
    if( typeof diagramValue !== "number" ) throw new Error("Matrix element is not a number.")

    const notSplitter: boolean = diagramValue !== -1

    if( notSplitter ){
        diagram.set( ii, jj, diagramValue + nStates)
        return [ 0, [jj]]
    }
    
    const nextJJ = [ jj - 1, jj + 1]
    var newBeams: number[] = []

    nextJJ.forEach( jj => {

        if( jj < 0 || jj >= diagram.nCols ) return
        const previousStates = diagram.get( ii, jj)

        if( previousStates === undefined ) return
        if( typeof previousStates !== "number") throw new Error("Matrix element is not a number.")

        diagram.set( ii, jj, previousStates + nStates)
        newBeams.push( jj )
    })

    return [ 1, newBeams]
}

const simulate = ( diagram: Matrix2D ) : number => {

    var split: number = 0
    var splits: number = 0
    var beamColumns: number[][] = [[ 0.5 * diagram.nCols - 0.5 ]]

    for( var ii = 1; ii < diagram.nRows; ii++){

        const currentBeams: number[] | undefined = beamColumns[ ii - 1 ]
        if( currentBeams === undefined ) throw new Error("Undefined beam row.")

        var newBeams: number[]
        var nextBeams: number[] = []

        currentBeams.forEach( jj => {

            [ split, newBeams] = splitBeam( ii, jj, diagram)

            splits = splits + split
            nextBeams.push( ...newBeams )
        })

        const uniqueBeamSet = new Set( nextBeams )
        nextBeams = Array.from( uniqueBeamSet )
        beamColumns.push( nextBeams )
    }

    return splits
}

export default { simulate }