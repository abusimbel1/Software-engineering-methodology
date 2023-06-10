class Country {
  constructor(name) {
    this.full = false
    this.dayWhenCompleted = -1
    this.cities = []
    this.name = name
  }

  onlyCountyMode() {
    this.full = true
    this.dayWhenCompleted = 0
  }

  appendCity(city) {
    this.cities.push(city)
  }

  equals(other) {
    return this.dayWhenCompleted === other.dayWhenCompleted
  }

  compareTo(other) {
    return this.dayWhenCompleted - other.dayWhenCompleted
  }

  hasForeignNeighbours() {
    for (const city of this.cities) {
      for (const neighbour of city.neighbours) {
        if (neighbour.countryName !== this.name) {
          return true
        }
      }
    }
    return false
  }

  checkFullness(day) {
    if (this.full) {
      return
    }
    for (const city of this.cities) {
      if (!city.full) {
        return
      }
    }
    this.full = true
    this.dayWhenCompleted = day
  }
}

module.exports = { Country }
