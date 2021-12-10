function log(input) {
    let string = `${String(`LAVAXE`+` Log`).brightRed}${` | `.grey}${`${new Date().toLocaleString()}`.cyan}${` | `.grey}`
    if (typeof input == "string") {
        console.log(string, input.split("\n").map(d => `${d}`).join(`\n${string} `))
    } else if (typeof input == "object") {
        console.log(string, JSON.stringify(input, null, 3))
    } else if (typeof input == "boolean") {
        console.log(string, String(input).cyan)
    } else {
        console.log(string, input)
    }
}

module.exports = log;