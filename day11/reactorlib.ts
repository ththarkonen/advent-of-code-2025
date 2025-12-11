import fs from "fs"

class Node {

    name: string
    outputs: string[]

    constructor( name: string, outputs: string[]){
        
        this.name = name
        this.outputs = outputs
    }
}

class Network {

    [ index: string]: any
    nNodes: number = 0

    addNode( node: Node ){
        this[node.name] = node
        this.nNodes += 1
    }
}

const parseNetwork = ( filePath: string ) => {

    var network = new Network()

    const data = fs.readFileSync( filePath, "utf-8");
    const lines = data.split("\n").filter( line => line.length > 0 );

    lines.forEach( line => {

        var [ name, outputsString] = line.split(":")
        
        if( name === undefined ) throw new Error("Undefined node name.")
        if( outputsString === undefined ) throw new Error("Undefined outputs.")

        const outputs = outputsString.trim().split(" ")
        const node = new Node( name, outputs)

        network.addNode( node )
    })

    return network
}

const addState = ( states: Record<string, number>, state: string, value: number) : object => {

    if( state === undefined ) throw new Error("Undefined state.")
    if( states[ state ] !== undefined ) states[ state ] += value
    else states[ state ] = value

    return states
}

const findPaths = ( network: Network, start: string, stop: string) : number => {

    var nextStates: { [key: string]: any } = {};
    nextStates[ start ] = 1
    
    var resultPaths = 0

    while( true ){

        var currentStates = Object.keys( nextStates )
        var newStates: { [key: string]: any } = {};

        currentStates.forEach( state => {

            const value = nextStates[ state ]

            const newNodes: string[] = network[ state ].outputs
            if( newNodes.includes( stop ) ) resultPaths = resultPaths + value

            newNodes.forEach( name => {
                if( name === stop || name === "out" ) return
                addState( newStates, name, value)
            })
        })
        
        nextStates = structuredClone( newStates )
        if( Object.keys( nextStates ).length === 0 ) break;
    }

    return resultPaths
}

export default { parseNetwork, findPaths}