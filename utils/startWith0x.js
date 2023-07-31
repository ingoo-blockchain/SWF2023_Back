const startsWith0x = (str) => {
    console.log(str)
    if (str.substring(0, 2) !== '0x') return false
    return true
}

module.exports = startsWith0x
