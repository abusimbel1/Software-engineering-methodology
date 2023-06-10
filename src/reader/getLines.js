const { parseInput } = require(".")

const getLines = async () => {
  try {
    return await parseInput()
  } catch (e) {
    console.log('Error: ', e)
    process.exit()
  }
}

module.exports = {getLines}
