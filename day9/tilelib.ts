import { Matrix2D } from "../utils/numty.ts"

class Tile {

    x: number
    y: number
    color: string = "red"

    constructor( row: (number | undefined)[] ){

        const x = row[0]
        const y = row[1]

        if( x === undefined ) throw new Error("Undefined x when creating a tile.")
        if( y === undefined ) throw new Error("Undefined y when creating a tile.")

        this.x = x
        this.y = y
    }
}

class Rectangle {

    corners: number[][]
    segments: number[][][]
    area: number

    constructor( tileII: Tile, tileJJ: Tile){

        const corner0 = [ tileII.x, tileII.y]
        const corner1 = [ tileJJ.x, tileJJ.y]

        const corner2 = [ tileII.x, tileJJ.y]
        const corner3 = [ tileJJ.x, tileII.y]

        const segment0 = [ corner0, corner2]
        const segment1 = [ corner1, corner3]

        const segment2 = [ corner2, corner1]
        const segment3 = [ corner3, corner0]

        this.corners = [ corner0, corner1, corner2, corner3]
        this.segments = [ segment0, segment1, segment2, segment3]
        
        var dx = tileJJ.x - tileII.x
        var dy = tileJJ.y - tileII.y

        dx = Math.abs( dx ) + 1
        dy = Math.abs( dy ) + 1

        this.area = dx * dy
    }
}

export class BoundingBox {
    
    lineSegments: Tile[][] = []

    constructor( tiles: Tile[] ){
        
        const ntiles = tiles.length

        for( var ii = 0; ii < ntiles - 1; ii++){

            const tileII = tiles[ii]
            const tileJJ = tiles[ii + 1]

            if( tileII === undefined ) throw new Error("Undefined tile in bounding box creation.")
            if( tileJJ === undefined ) throw new Error("Undefined tile in bounding box creation.")

            const lineSegment = [ tileII, tileJJ]
            this.lineSegments.push( lineSegment )
        }

        const tileII = tiles[ ntiles - 1 ]
        const tileJJ = tiles[ 0 ]

        if( tileII === undefined ) throw new Error("Undefined tile in bounding box creation.")
        if( tileJJ === undefined ) throw new Error("Undefined tile in bounding box creation.")

        const lineSegment = [ tileII, tileJJ]
        this.lineSegments.push( lineSegment )
    }
}

const parseTiles = ( data: Matrix2D ) : Tile[] => {

    var tiles: Tile[] = []

    data.rows.forEach( row => {
        const tile = new Tile( row )
        tiles.push( tile )
    })

    return tiles
}

const createRectangles = ( tiles: Tile[] ) : Rectangle[] => {

    const rectangles: Rectangle[] = []
    const ntiles = tiles.length

    for( var ii = 0; ii < ntiles; ii++){
        for( var jj = ii + 1; jj < ntiles; jj++){

            const tileII = tiles[ii]
            const tileJJ = tiles[jj]

            if( tileII === undefined ) throw new Error("Undefined tile in rectangle creation.")
            if( tileJJ === undefined ) throw new Error("Undefined tile in rectangle creation.")

            const rectangle = new Rectangle( tileII, tileJJ)
            rectangles.push( rectangle )
        }
    }

    rectangles.sort( ( a, b) => b.area - a.area)
    return rectangles
}

const isContained = ( rectangle: Rectangle, box: BoundingBox): boolean => {

    var inBoundingBox: boolean
    const nLineSegments = box.lineSegments.length

    for( var ii = 0; ii < 4; ii++){

        const cornerII = rectangle.corners[ii]

        if( cornerII === undefined ) throw new Error("Undefined corner.")

        const cornerX = cornerII[0]
        const cornerY = cornerII[1]

        if( cornerX === undefined || cornerY === undefined ) throw new Error("Undefined corner.")

        var crossings = 0
        var onSegment = false
        for( var jj = 0; jj < nLineSegments; jj++){
            
            const lineSegmentJJ = box.lineSegments[jj]
            if( lineSegmentJJ === undefined ) throw new Error("Undefined line segment.")

            const startTile = lineSegmentJJ[0]
            const stopTile = lineSegmentJJ[1]

            if( startTile === undefined ) throw new Error("Undefined line segment tile.")
            if( stopTile === undefined ) throw new Error("Undefined line segment tile.")
            
            const minX = Math.min( startTile.x, stopTile.x)
            const maxX = Math.max( startTile.x, stopTile.x)

            const minY = Math.min( startTile.y, stopTile.y)
            const maxY = Math.max( startTile.y, stopTile.y)

            var onSegment = minX <= cornerX && cornerX <= maxX
            onSegment = onSegment && minY <= cornerY && cornerY <= maxY
            if( onSegment ) break

            if( minY == cornerY && maxY == cornerY && cornerX < maxX ){

                var prevIndex: number = jj - 1
                var nextIndex: number = jj + 1

                if( prevIndex < 0 ) prevIndex = nLineSegments - 1
                if( nextIndex === nLineSegments ) nextIndex = 0 

                const prevSegment = box.lineSegments[ prevIndex ]
                const nextSegment  = box.lineSegments[ nextIndex ]

                if( prevSegment === undefined ) throw new Error("Undefined previous line segment.")
                if( nextSegment === undefined ) throw new Error("Undefined previous line segment.")

                const prevTile = prevSegment[0]
                const nextTile = nextSegment[1]

                if( prevTile === undefined ) throw new Error("Undefined line segment tile.")
                if( nextTile === undefined ) throw new Error("Undefined line segment tile.")

                const yPrev = prevTile.y
                const yNext = nextTile.y

                const dyPrev = maxY - yPrev
                const dyNext = yNext - maxY

                const dyPrevSign = dyPrev >= 0
                const dyNextSign = dyNext >= 0

                if( dyPrevSign === dyNextSign ) crossings = crossings + 1
                continue
            }

            var segmentCrossed = (minY <= cornerY) && (cornerY <= maxY)
            segmentCrossed = segmentCrossed && (cornerX < maxX)
            if( segmentCrossed ) crossings = crossings + 1
        }

        inBoundingBox = crossings % 2 !== 0 || onSegment
        if( !inBoundingBox ) return false
    }

    return true
}

const isIntersecting = ( rectangle: Rectangle, box: BoundingBox): boolean => {

    const nLineSegments = box.lineSegments.length

    for( var ii = 0; ii < 4; ii++){

        const segmentII = rectangle.segments[ii]
        if( segmentII === undefined ) throw new Error("Undefined rectangle segment.")

        const cornerJJ = segmentII[0]
        const cornerKK = segmentII[1]

        if( cornerJJ === undefined ) throw new Error("Undefined segment corner.")
        if( cornerKK === undefined ) throw new Error("Undefined segment corner.")

        const xJJ = cornerJJ[0]
        const xKK = cornerKK[0]

        const yJJ = cornerJJ[1]
        const yKK = cornerKK[1]

        if( xJJ === undefined || xKK === undefined ) throw new Error("Undefined corner coordinate.")
        if( yJJ === undefined || yKK === undefined ) throw new Error("Undefined corner coordinate.")

        const minX = Math.min( xJJ, xKK)
        const maxX = Math.max( xJJ, xKK)

        const minY = Math.min( yJJ, yKK)
        const maxY = Math.max( yJJ, yKK)

        const horizontal = minY === maxY

        for( var jj = 0; jj < nLineSegments; jj++){

            var intersection: boolean = false

            const lineSegmentJJ = box.lineSegments[jj]
            if( lineSegmentJJ === undefined ) throw new Error("Undefined line segment.")

            const startTile = lineSegmentJJ[0]
            const stopTile = lineSegmentJJ[1]

            if( startTile === undefined ) throw new Error("Undefined tile.")
            if( stopTile === undefined ) throw new Error("Undefined tile.")
            
            const minSegmentX = Math.min( startTile.x, stopTile.x)
            const maxSegmentX = Math.max( startTile.x, stopTile.x)

            const minSegmentY = Math.min( startTile.y, stopTile.y)
            const maxSegmentY = Math.max( startTile.y, stopTile.y)
            
            if( horizontal ){
                
                var yLevel = maxY
                var segmentX = maxSegmentX

                intersection = minX < segmentX && segmentX < maxX
                intersection = intersection && minSegmentY < yLevel && yLevel < maxSegmentY

                if( intersection ) return true
            } else {

                var xLevel = maxX
                var segmentY = maxSegmentY

                intersection = minY < segmentY && segmentY < maxY
                intersection = intersection && minSegmentX < xLevel && xLevel < maxSegmentX

                if( intersection ) return true
            }
        }
    }

    return false
}

const validateRectangle = ( rectangle: Rectangle, box: BoundingBox) : boolean => {

    const contained = isContained( rectangle, box)
    if( !contained ) return false

    const intersecting = isIntersecting( rectangle, box)
    if( intersecting ) return false
    
    return true
}

const findLargestRectangle = ( rectangles: Rectangle[], box: BoundingBox) : Rectangle => {

    var rectangle: Rectangle | undefined
    var validRectangle: boolean
    
    const nRectangles = rectangles.length

    for( var ii = 0; ii < nRectangles; ii++){

        rectangle = rectangles[ii]
        if( rectangle === undefined ) throw new Error("Undefined rectangle.")

        validRectangle = validateRectangle( rectangle, box)
        if( validRectangle ) break
    }

    if( rectangle === undefined ) throw new Error("Undefined rectangle.")
    return rectangle
}

export default { parseTiles, createRectangles, findLargestRectangle}