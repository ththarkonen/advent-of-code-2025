import fs from "fs"

export class Safe {

    current: number
    states: number[]
    maxState: number = 99

    constructor( initialState: number ) {

        this.current = initialState
        this.states = [ initialState ]
    }

    rotate( rotation: number ) {

        var state = this.current + rotation

        if( state < 0 ) state = this.maxState + state + 1
        if( state > this.maxState ) state = state % this.maxState - 1

        this.current = state
        this.states.push( state )
    }

    countStates( countedState: number ){
        
        const validStates = this.states.filter( state => state == countedState )
        return validStates.length;
    }
}

const readRotations = ( filePath: string, safe: Safe) => {

    const data = fs.readFileSync( filePath, "utf-8")
    var lines = data.split("\n").filter( line => line.length > 0 )

    lines = lines.map( line => line.replace( "L", "-") )
    lines = lines.map( line => line.replace( "R", "") )

    const remainderFactor = safe.maxState + 1
    const rotations = lines.map( line => Number( line ) % remainderFactor )

    return rotations
}

const readProtocalRotations = ( filePath: string ) => {

    const data = fs.readFileSync( filePath, "utf-8")
    var lines = data.split("\n").filter( line => line.length > 0 )

    lines = lines.map( line => line.replace( "L", "-") )
    lines = lines.map( line => line.replace( "R", "") )
    const rotations = lines.map( line => Number( line ) )

    var clicks: number[] = []

    rotations.forEach( rotation => {
        
        const nClicks = Math.abs( rotation )
        const sign = rotation < 0 ? -1 : 1

        const rotationClicks = new Array<number>( nClicks ).fill( sign )
        clicks.push( ...rotationClicks )
    })

    return clicks
}

export default { readRotations, readProtocalRotations, Safe}