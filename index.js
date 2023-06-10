const { getLines } = require('./src/reader/getLines')
const { Map } = require('./src/map')

const getEuroDiffusion = async () => {
  const lines = await getLines()

  for (let i = 0; i < lines.length; i++) {
    console.log(`Case Number ${i + 1}`)

    try {
      const map = new Map(lines[i])
      map.simulateEuroDiffusion()

      map.countries.forEach((country) => {
        console.log(country.name, country.dayWhenCompleted)
      })
    } catch (e) {
      console.log('Error occured: ', e)
    }
  }
}

getEuroDiffusion()
