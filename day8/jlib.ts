import { Matrix2D } from "../utils/numty.ts"

class JunctionBox {

    x: number
    y: number
    z: number

    circuit: JunctionBox[] = [ this ]

    constructor( location: number[] ){

        this.x = location[0] as number
        this.y = location[1] as number
        this.z = location[2] as number
    }
}


const parseJunctionBoxes = ( data: Matrix2D ) : JunctionBox[] => {

    var junctionBoxes: JunctionBox[] = []
    data.rows.forEach( row => {

        const box: JunctionBox = new JunctionBox( row as number[] )
        junctionBoxes.push( box )
    })

    return junctionBoxes
}


const L22 = ( box0: JunctionBox, box1: JunctionBox) : number => {
    
    const dx = box1.x - box0.x
    const dy = box1.y - box0.y
    const dz = box1.z - box0.z

    return dx ** 2 + dy ** 2 + dz ** 2
}


const computeDistances = ( boxes: JunctionBox[] ) : ( number | JunctionBox )[][] => {

    var distances: ( JunctionBox | number )[][] = []

    for( var ii = 0; ii < boxes.length; ii++){
        for( var jj = ii + 1; jj < boxes.length; jj++){

            const boxII = boxes[ii] as JunctionBox
            const boxJJ = boxes[jj] as JunctionBox

            const L22_ii_jj = L22( boxII, boxJJ)
            distances.push( [ boxII, boxJJ, L22_ii_jj] )
        }
    }

    distances = distances.sort( ( a, b) => {
        
        const d0 = a[2] as number
        const d1 = b[2] as number
        return d0 - d1 
    })

    return distances
}


const connect = ( boxPairs: (JunctionBox | number)[][],
                  boxes: JunctionBox[],
                  nConnections: number,
                  startingConnections: number = 0) : JunctionBox[] => {

    var result: JunctionBox[] = []
    var connections = startingConnections
    var nUniqueCircuits = getCircuits( boxes ).length

    while( connections < nConnections && nUniqueCircuits > 1 ){

        const pair = boxPairs[ connections ] as (JunctionBox | number)[]

        const box = pair[0] as JunctionBox
        const targetBox = pair[1] as JunctionBox
        const connectedBoxes = box.circuit.includes( targetBox )

        result = [ box, targetBox]
        connections = connections + 1
        
        if( connectedBoxes ) continue

        box.circuit.push( ...targetBox.circuit )
        box.circuit.forEach( connectedBox => {

            if( connectedBox === box ) return
            connectedBox.circuit = box.circuit
        })

        nUniqueCircuits = nUniqueCircuits - 1
    }

    return result
}


const getCircuits = ( boxes: JunctionBox[] ) : JunctionBox[][] => {

    var uniqueCircuits: JunctionBox[][] = []

    boxes.forEach( box => {

        const processed = uniqueCircuits.includes( box.circuit )
        if( processed ) return

        uniqueCircuits.push( box.circuit )
    })

    uniqueCircuits.sort( ( a, b) => b.length - a.length )
    return structuredClone( uniqueCircuits )
}


const parseResultPart1 = ( circuits: JunctionBox[][], nCircuits: number) : number => {

    var result = 1
    for( var ii = 0; ii < nCircuits; ii++){

        const circuitII = circuits[ii] as JunctionBox[]
        result = result * circuitII.length
    }

    return result
}


const parseResultPart2 = ( finalBoxes: JunctionBox[] ) : number => {

    const box = finalBoxes[0] as JunctionBox
    const targetBox = finalBoxes[1] as JunctionBox

    return box.x * targetBox.x
}


export default { parseJunctionBoxes,
                 computeDistances,
                 connect,
                 getCircuits,
                 parseResultPart1,
                 parseResultPart2}