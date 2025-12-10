import fs, { stat } from "fs"
import solver from "@uandi/javascript-lp-solver"

class Diagram {

    lights: number[] = []
    target: number[] = []
    buttons: number[][] = []
    nButtons: number = 0
    joltages: number[] = []

    constructor( line: string ){

        const lineData = line.split(" ")

        for( var ii = 0; ii < lineData.length; ii++){

            var itemII = lineData[ii]
            if( itemII === undefined ) throw new Error("Undefined line element.")

            itemII = itemII.replace("[","")
            itemII = itemII.replace("]","")
            itemII = itemII.replace("(","")
            itemII = itemII.replace(")","")
            itemII = itemII.replace("{","")
            itemII = itemII.replace("}","")

            if( ii === 0 ){
                this.target = itemII.split("").map( x => x === "#" ? 1 : 0)
                this.lights = new Array( this.target.length ).fill( 0 )
            } else if( ii === lineData.length - 1 ) {
                this.joltages = itemII.split(",").map( x => Number(x) )
            } else {
                this.buttons.push(  itemII.split(",").map( x => Number(x) ) )
            }
        }

        this.nButtons = this.buttons.length
    }

    press( button: number[], lights: number[]){

        button.forEach( ii => {
            const lightII = lights[ii]
            if( lightII === undefined ) throw new Error("Undefined light.")
            lights[ii] = ( lightII + 1 ) % 2
        })

        return lights
    }

    pressButtons( state: number[] ) : number[][] {

        var newStates: number[][] = []

        for( var ii = 0; ii < this.nButtons; ii++){

            const buttonII = this.buttons[ii]
            if( buttonII === undefined ) throw new Error("Undefined button.")

            var newState = structuredClone( state )
            newState = this.press( buttonII, newState)

            const included = newStates.includes( newState )
            if( !included ) newStates.push( newState )
        }

        return newStates
    }

    turnOn() {

        var checkedStates = [ structuredClone( this.lights ) ]
        var nextStates: number[][] = [ structuredClone( this.lights ) ]
        var steps = 0

        while( true ){

            var currentStates = structuredClone( nextStates )
            var nextStates: number[][] = [ ]

            currentStates.forEach( state => {
                const newStates = this.pressButtons( state )
                addUniqueStates( nextStates, newStates, checkedStates)
            })

            steps = steps + 1
            const targetReached = checkTarget( nextStates, this.target)
            if( targetReached ) break
        }

        return steps
    }
}

const parseData = ( filePath: string ) : Diagram[] => {

    const data = fs.readFileSync( filePath, "utf-8");
    const lines = data.split("\n").filter( line => line.length > 0 );
    const diagrams: Diagram[] = []

    lines.forEach( line => {
        const diagram = new Diagram( line )
        diagrams.push( diagram )
    })

    return diagrams
}

const checkTarget = ( states: number[][], target: number[] ) : boolean => {

    const nStates = states.length
    
    for( var ii = 0; ii < nStates; ii++){

        const stateII = states[ii]
        if( stateII === undefined ) throw new Error("Undefined state.")

        const targetReached = stateII.every( (x,ii) => x === target[ii] )
        if( targetReached ) return true
    }

    return false
}

const addUniqueStates = ( states: number[][], newStates: number[][], checkedStates: number[][]) : number[][] => {

    newStates.forEach( newState => {
        const included = checkTarget( states, newState) || checkTarget( checkedStates, newState)
        if( !included ) states.push( newState )
        if( !included ) checkedStates.push( newState )
    })

    return states
}

const toggleDiagramJoltages = ( diagram: Diagram ) : number => {

    const nConstraints = diagram.joltages.length
    const nVariables = diagram.buttons.length

    var constraints: { [key: string]: object } = {}
    var variables: { [key: string]: object } = {}
    var integers: { [key: string]: number } = {}

    var basicVariable: { [key: string]: number } = {}
    basicVariable["steps"] = 1

    for( var ii = 0; ii < nConstraints; ii++){
        basicVariable[ii] = 0

        const joltageII = diagram.joltages[ii]
        constraints[ii] = {"min": joltageII, "max": joltageII}
    }

    for( var ii = 0; ii < nVariables; ii++){

        var variableII = structuredClone( basicVariable )
        const buttonII = diagram.buttons[ii]
        if( buttonII === undefined ) throw new Error("Undefined")

        buttonII.forEach( jj => {
            variableII[jj] = 1
        })

        variables[ii] = variableII
        integers[ii] = 1
    }

    var model: { [key: string]: number | string | object } = {}
    model["optimize"] = "steps"
    model["opType"] = "min"
    model["constraints"] = constraints
    model["variables"] = variables
    model["ints"] = integers

    const solution = solver.Solve( model );
    return solution.result
}

const toggleLights = ( diagrams: Diagram[] ) : number => {

    var result: number = 0

    diagrams.forEach( diagram => {

        const steps = diagram.turnOn()
        result = result + steps
    })

    return result
}

const toggleJoltages = ( diagrams: Diagram[] ) : number => {

    var result: number = 0

    diagrams.forEach( diagram => {
        const steps = toggleDiagramJoltages( diagram )
        result = result + steps
    })

    return result
}

export default { parseData, toggleLights, toggleJoltages}