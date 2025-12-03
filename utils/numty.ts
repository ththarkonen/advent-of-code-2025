import fs from "fs";

const parseColumns = ( rows: number[][] ) => {
    
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

    rows: number[][];
    cols: number[][];

    nRows: number;
    nCols: number;
    shape: number[];

    constructor( rows: number[][] ) {

        this.rows = rows;
        this.cols = parseColumns( rows );

        this.nRows = this.rows.length;
        this.nCols = this.cols.length;

        this.shape = [ this.nRows, this.nCols];
    }
}

const readmatrix = ( filePath: string, separator?: string ) => {

    var rows;

    if( separator != undefined ) {

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

    var sorted: number[][] = []

    data.rows.forEach( vector => {

        vector.sort()
        if( !ascending ) vector.reverse()
            
        sorted.push( vector )
    });

    return new Matrix2D( sorted )
}

export default { readmatrix, Matrix2D, range, sort}
