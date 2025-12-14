import fs from "fs"

const sad = ( filePath: string ) => {

    const data = fs.readFileSync( filePath, "utf-8")
    const lines = data.split("\n")

    var result = 0;
    lines.forEach( line => {

        const isAreaLine = line.includes("x")
        if( !isAreaLine ) return

        const [ areaString, presentsString ] = line.split(":")
        const area = areaString?.replace(":","").split("x").reduce( ( a, b) => Number(a) * Number(b), 1)
        const presentArea = presentsString?.split(" ").reduce( ( a, b) => a + 7 * Number(b), 0)

        if( area === undefined || presentArea === undefined ) return
        const enoughSpace = area >= presentArea
        if( enoughSpace ) result += 1
    })

    return result
}

export default { sad }