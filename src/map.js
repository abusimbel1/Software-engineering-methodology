const { Country } = require('./country')
const { City } = require('./city')
const { GRID_SIZE } = require('../config')

class Map {
  constructor(countriesData) {
    this.grid = Array.from({ length: GRID_SIZE + 2 }, () =>
      Array(GRID_SIZE + 2).fill(null)
    )
    this.countries = []
    this.createGrid(countriesData)
    this.validateForeignNeighbours()
  }

  getDataByCoordinates(x, y) {
    return this.grid[x][y] !== null
  }

  getNeighbours(x, y) {
    const neighbours = []

    if (this.getDataByCoordinates(x, y + 1)) {
      neighbours.push(this.grid[x][y + 1])
    }
    if (this.getDataByCoordinates(x, y - 1)) {
      neighbours.push(this.grid[x][y - 1])
    }
    if (this.getDataByCoordinates(x + 1, y)) {
      neighbours.push(this.grid[x + 1][y])
    }
    if (this.getDataByCoordinates(x - 1, y)) {
      neighbours.push(this.grid[x - 1][y])
    }

    return neighbours
  }

  validateForeignNeighbours() {
    if (this.countries.length <= 1) {
      return
    }
    for (const country of this.countries) {
      if (!country.hasForeignNeighbours()) {
        throw new Error(`${country.name} can't spread to other country`)
      }
    }
  }

  simulateEuroDiffusion() {
    if (this.countries.length === 1) {
      this.countries[0].onlyCountyMode()
      return
    }

    let full = false
    let day = 1
    while (!full) {
      for (let x = 0; x <= GRID_SIZE; x++) {
        for (let y = 0; y <= GRID_SIZE; y++) {
          if (this.grid[x][y] !== null) {
            const city = this.grid[x][y]
            city.transferToNeighbours()
          }
        }
      }

      for (let x = 0; x <= GRID_SIZE; x++) {
        for (let y = 0; y <= GRID_SIZE; y++) {
          if (this.grid[x][y] !== null) {
            const city = this.grid[x][y]
            city.finalizeBalancePerDay()
          }
        }
      }

      full = true
      for (const country of this.countries) {
        country.checkFullness(day)
        if (!country.full) {
          full = false
        }
      }

      day += 1
    }

    this.countries.sort()
  }

  createGrid(countriesData) {
    for (const country_data of countriesData) {
      const country = new Country(country_data.name)
      for (let x = country_data.ll.x; x <= country_data.ur.x; x++) {
        for (let y = country_data.ll.y; y <= country_data.ur.y; y++) {
          if (this.grid[x][y] !== null) {
            throw new Error(
              `${this.grid[x][y].countryName} intersects with ${country.name} on [${x}, ${y}]`
            )
          }
          const city = new City(country.name, countriesData, x, y)
          this.grid[x][y] = city
          country.appendCity(city)
        }
      }
      this.countries.push(country)
    }

    for (const row of this.grid) {
      for (const city of row) {
        if (city !== null) {
          const neighboursList = this.getNeighbours(city.x, city.y)
          city.setNeighbours(neighboursList)
        }
      }
    }
  }
}

module.exports = { Map }
