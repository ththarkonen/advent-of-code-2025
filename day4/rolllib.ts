import nt from "../utils/numty.ts"
import { Matrix2D } from "../utils/numty.ts"

const removeCurrentRolls = ( map: Matrix2D, nAdjacent: number)
                         : number[][] => {

    const kernelSize = 1
    const [ kernelBaseII, kernelBaseJJ] = nt.kernelInds( kernelSize )

    var currentII: number[] = []
    var currentJJ: number[] = []
    var removedRolls: number[][] = []

    for( var ii = 0; ii < map.nRows; ii++){
        for( var jj = 0; jj < map.nCols; jj++){

            currentII[0] = ii
            currentJJ[0] = jj

            const currentValue = map.get( currentII, currentJJ)[0]
            if( currentValue == 0 ) continue

            var kernelII: number[] = kernelBaseII.map( x => x + ii )
            var kernelJJ: number[] = kernelBaseJJ.map( y => y + jj );

            [ kernelII, kernelJJ] = nt.verifyIndices( kernelII, kernelJJ, map)

            var values = map.get( kernelII, kernelJJ)
            const neighbours = values.filter( value => value == 1 ).length

            const enoughSpace: boolean = neighbours < nAdjacent + 1
            if( !enoughSpace ) continue
            
            const roll: number[] = [ ii, jj]
            removedRolls.push( roll )
        }
    }

    return removedRolls
}

const updateMap = ( map: Matrix2D, rolls: number[][] )
                : Matrix2D => {

    rolls.forEach( roll => {

        const ii = roll[0]
        const jj = roll[1]
        const value = 0;

        map.set( ii, jj, value)
    })

    return map
}

const removeRolls = ( map: Matrix2D, nAdjacent: number)
                  : [ number[][][], number[]] => {

    var tempRemovedRolls: number[][]

    var totalRemoved: number = 0
    var removedRolls: number[][][] = []
    var totalRemovedList: number[] = []

    var removingRolls: boolean = true
    while( removingRolls ){

        tempRemovedRolls = removeCurrentRolls( map, nAdjacent)

        removingRolls = tempRemovedRolls.length > 0
        if( !removingRolls ) break

        totalRemoved = totalRemoved + tempRemovedRolls.length
        removedRolls.push( tempRemovedRolls )
        totalRemovedList.push( totalRemoved )

        map = updateMap( map, tempRemovedRolls)
    }

    return [ removedRolls, totalRemovedList]
}

export default { removeRolls }