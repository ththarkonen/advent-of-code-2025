import fs from "fs"

const parseElement = ( columnStrings: ( string | undefined )[], index: number) : number => {

    var cephalopodElementString =  ""

    columnStrings.forEach( xString => {
        if( xString === undefined ) throw new Error("Undefined column element.")
        cephalopodElementString += xString[ index ]
    })

    cephalopodElementString = cephalopodElementString.replaceAll(" ", "")
    const cephalopodElement: number = Number( cephalopodElementString )

    return cephalopodElement
}

const parseCephalopodColumns = ( columns: (string | undefined)[][] ): number[][] => {

    if( columns === undefined ) throw new Error("Undefined columns.")
    const cephalopodColumns: number[][] = []

    columns.forEach( column => {

        if( column === undefined ) throw new Error("Undefined column.")

        var cephalopodElement: number
        const cephalopodColumn: number[] = []

        const elementLength = column[0]?.length
        if( elementLength === undefined ) throw new Error("Undefined column element length.")
            
        for( var ii = 0; ii < elementLength; ii++){

            cephalopodElement = parseElement( column, ii)
            cephalopodColumn.push( cephalopodElement )
        }

        cephalopodColumns.push( cephalopodColumn )
    })

    return cephalopodColumns
}

const parseSpacings = ( operations: string ) : number[][] => {

    var spacings: number[][] = []

    var start = 0
    var stop = 0

    for( var ii = 1; ii < operations.length; ii++){

        const symbol = operations[ii]
        if( symbol !== "+" && symbol !== "*" ) continue
        
        stop = ii - 2;
        spacings.push([ start, stop])
        start = ii;
    }
    
    stop = ii - 1;
    spacings.push([ start, stop])

    return spacings
}

const parseSpacedColumn = ( spacing: number[], data: string[]) : string[] => {

    if( spacing === undefined ) throw new Error("Undefined spacing.")

    var column: string[] = []

    const spacingStart = spacing[0]
    const spacingStop = spacing[1]
    if( spacingStart === undefined || spacingStop === undefined ) throw new Error("Undefined spacing.")
    
    for( var jj = 0; jj < data.length; jj++){

        const rowJJ = data[jj]
        const stringElement = rowJJ?.substring( spacingStart, spacingStop + 1)

        if( stringElement === undefined ) throw new Error("Undefined substring.")
        column.push( stringElement )
    }

    return column
}

const parseSpacedData = ( dataFilePath: string, operationsFilePath: string) : string[][] => {

    var data = fs.readFileSync( dataFilePath, "utf-8")
    var dataLines = data.split("\n")
    dataLines = dataLines.filter( line => line.length != 0 )

    var operationsLine = fs.readFileSync( operationsFilePath, "utf-8")

    const spacings = parseSpacings( operationsLine )

    var columns: string[][] = []
    const nColumns = spacings.length

    for( var ii = 0; ii < nColumns; ii++){

        const spacing = spacings[ii]
        if( spacing === undefined ) throw new Error("Invalid spacing.")

        const column: string[] = parseSpacedColumn( spacing, dataLines)
        columns.push( column )
    }

    return columns
}

const performOperations = ( operations: string[], columns: number[][]) : number => {

    var resultSum = 0
    var results: number[] = [];

    columns.forEach( ( column, ii) => {

        var result: number | undefined = undefined
        const operation: string | undefined = operations?.[ii]
        if( operation === undefined ) throw new Error("Undefined operation.")

        if( operation === "*" ) result = column.reduce( ( a, b) => a * b, 1)
        if( operation === "+" ) result = column.reduce( ( a, b) => a + b, 0)

        if( result === undefined ) throw new Error("Undefined operation result.")
        results.push( result )
    })

    resultSum = results.reduce( ( a, b) => a + b)
    return resultSum
}

export default { parseCephalopodColumns, parseSpacedData, performOperations}