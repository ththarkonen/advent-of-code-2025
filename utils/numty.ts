import fs from "fs";

export type Encoder = {
    [ index: string]: number
}

const parseColumns = ( rows: ( number | undefined )[][] ) => {
    
    const nRows = rows.length;
    const nCols = rows[0] != undefined ? rows[0].length : 0;

    if( nCols == 0 ) {
        return [[]];
    }

    var column: number[];
    var columns: number[][] = [];

    for( var columnIndex = 0; columnIndex < nCols; columnIndex++ ) {

        column = [];

        for( var rowIndex = 0; rowIndex < nRows; rowIndex++ ) {

            const row = rows[rowIndex];
            const value = row?.[columnIndex];

            if( value == undefined || row?.length != nCols ) {
                throw new Error("Number of colums is not consistent across rows.");
            };
     
            column.push( value );
        };

        columns.push( column );
    };

    return columns
}

export class Matrix2D {

    rows: ( number | undefined )[][];
    cols: ( number | undefined )[][];

    nRows: number;
    nCols: number;
    shape: number[];

    constructor( rows: ( number | undefined )[][] ) {

        this.rows = rows;
        this.cols = parseColumns( rows );

        this.nRows = this.rows.length;
        this.nCols = this.cols.length;

        this.shape = [ this.nRows, this.nCols];
    }

    get( rowInds: number[], colInds: number[]): number[]{

        const nRowInds = rowInds.length
        const nColdInds = colInds.length

        if( nRowInds != nColdInds ) throw new Error("Index vectors must be of equal length!")

        var ii
        var jj
        var element
        var elements: number[] = []

        for( var n = 0; n < nRowInds; n++){
            
            ii = rowInds[n]
            jj = colInds[n]

            if( ii == undefined || jj == undefined ) throw new Error("Undefined indices!")
            element = this.rows?.[ii]?.[jj]

            if( element == undefined ) throw new Error("Undefined matrix element!")
            elements.push( element )
        }

        return elements
    }

    getrow( ii: number | undefined ) {
        if( ii === undefined ) throw new Error("Invalid row index.")
        if( ii < 0 || ii >= this.nRows ) throw new Error("Row index out of bounds.")
        return structuredClone( this.rows[ii] )
    }

    getcol( jj: number | undefined ) {
        if( jj === undefined ) throw new Error("Invalid column index.")
        if( jj < 0 || jj >= this.nCols ) throw new Error("Column index out of bounds.")
        return structuredClone( this.cols[jj] )
    }

    set( ii: number | undefined, jj: number | undefined, value: number | undefined){

        if( value == undefined ) throw new Error("Invalid value.")
        if( ii === undefined || jj === undefined) throw new Error("Invalid indices.")
        if( ii < 0 || ii >= this.nRows || jj < 0 || jj >= this.nCols ) throw new Error("Indices out of bounds.")

        const row = this.rows[ii]
        const col = this.cols[jj]

        if( row === undefined || col === undefined ) throw new Error("Undefined row or column.")

        row[jj] = value
        col[ii] = value
    }
}

const readmatrix = ( filePath: string, separator?: string, encoder?: Encoder) => {

    var rows: ( number | undefined )[][];

    if( separator != undefined && encoder != undefined ) {

        const data = fs.readFileSync( filePath, "utf-8");
        const lines = data.split("\n").filter( line => line.length > 0 );

        rows = lines.map( line => line.split( separator ).map( x => encoder[x] ) );
        
    } else if ( separator != undefined ) {

        const data = fs.readFileSync( filePath, "utf-8");
        const lines = data.split("\n").filter( line => line.length > 0 );

        rows = lines.map( line => line.split( separator ).map( Number ) );

    } else {

        const data = fs.readFileSync( filePath, "utf-8");
        const lines = data.split("\n").filter( line => line.length > 0 );

        rows = lines.map( line => [Number(line)] );
    };
    
    return new Matrix2D( rows );
}

const range = ( minimum: number, maximum: number, step: number = 1) => {

    var vector = []

    var x = minimum
    while( x < maximum ){
        vector.push( x )
        x = x + step
    }

    return vector
}

const sort = ( data: Matrix2D, axis: number = 1, ascending = true) => {

    var sorted: ( number | undefined )[][] = []

    data.rows.forEach( vector => {

        vector.sort()
        if( !ascending ) vector.reverse()

        sorted.push( vector )
    });

    return new Matrix2D( sorted )
}

const verifyIndices = ( rowInds: number[], colInds: number[], map: Matrix2D)
                       : [ number[], number[]] => {

    const nInds = rowInds.length
    const nRows = map.nRows
    const nCols = map.nCols

    var filteredRowInds: number[] = []
    var filteredColInds: number[] = []

    for( var n = 0; n < nInds; n++){

        const ii = rowInds[n]
        const jj = colInds[n]

        if( ii === undefined || jj === undefined ) throw new Error("Invalid indices!")

        var validInd = ( 0 <= ii ) && ( ii < nRows )
        validInd = validInd && ( 0 <= jj ) && ( jj < nCols )

        if( !validInd ) continue
        
        filteredRowInds.push( ii )
        filteredColInds.push( jj )
    }

    return [ filteredRowInds, filteredColInds]
}

const kernelInds = ( size: number )
                 : [ number[], number[]] => {

    var rowInds: number[] = []
    var colInds: number[] = []

    for( var ii = -size; ii <= size; ii++){
        for( var jj = -size; jj <= size; jj++){
            rowInds.push( ii )
            colInds.push( jj )
        }
    }

    return [ rowInds, colInds]
}

export default { Matrix2D, 
                 readmatrix,
                 range,
                 sort,
                 verifyIndices,
                 kernelInds}
