const fs = require('fs')
const {
  PATH_TO_THE_INPUT_FILE,
  MAX_COUNTRIES_AMOUNT,
  GRID_SIZE,
} = require('../../config')
const { namePattern } = require('./config')
const { getCountry } = require('./getCountry')

function readLines(filepath) {
  const data = fs.readFileSync(filepath, 'utf8')
  return data.split('\n')
}

function parseCountry(line) {
  const args = line.split(' ')
  if (args.length !== 5) {
    throw new Error(`Error at line ${line} - wrong number of countries`)
  }

  if (!namePattern.test(args[0])) {
    throw new Error(`Error at line ${line} - wrong country name`)
  }

  for (let i = 1; i <= 4; i++) {
    const coord = parseInt(args[i])
    if (coord <= 0 || coord >= GRID_SIZE + 1) {
      throw new Error(`Error at line ${line} - Wrong coordinates`)
    }
  }

  return getCountry(args)
}

function parseInput() {
  const cases = []
  const lines = readLines(PATH_TO_THE_INPUT_FILE)
  let lineIndex = 0
  let caseNumber = 0
  while (lineIndex < lines.length) {
    const countriesLen = parseInt(lines[lineIndex])
    if (countriesLen === 0) {
      return cases
    }
    if (countriesLen > MAX_COUNTRIES_AMOUNT || countriesLen < 1) {
      throw new Error(
        `Error in input for ${caseNumber + 1}: wrong number of countries`
      )
    }
    lineIndex += 1

    const countriesList = []
    for (let j = 0; j < countriesLen; j++) {
      const parsed = parseCountry(lines[lineIndex])
      countriesList.push(parsed)
      lineIndex += 1
    }
    caseNumber += 1
    cases.push(countriesList)
  }
  return cases
}

module.exports = { parseInput }
