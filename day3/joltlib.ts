
const checkJoltage = ( bank: number[], nBatteries: number) => {

    var joltage = 0

    var maxJolt
    var maxIndex
    var validPart
    var reducedBank = bank

    for( var ii = nBatteries - 1; ii >= 0; ii--){

        if( ii == 0 ) validPart = reducedBank.slice( 0 )
        else          validPart = reducedBank.slice( 0, -ii)

        maxJolt = Math.max( ...validPart )
        maxIndex = reducedBank.indexOf( maxJolt )

        joltage = joltage + 10 ** ii * maxJolt
        reducedBank = reducedBank.slice( maxIndex + 1 )
    }

    return joltage
}

export default { checkJoltage }