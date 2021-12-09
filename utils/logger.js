function log(input) {
    let string = `${String(`LAVAXE`+` Log`).brightRed}${` | `.grey}${`${new Date().toLocaleString()}`.cyan}${` | `.grey}`
    console.log(string + input);
}

module.exports = log;