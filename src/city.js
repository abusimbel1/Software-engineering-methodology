const { INITIAL_CITY_BALANCE, REPRESENTATIVE_PORTION } = require("../config");

class City {
    constructor(countryName, countriesList, x, y) {
      this.balance = {};
      this.balancePerDay = {};
      this.neighbours = [];
      this.full = false;
      this.countryName = countryName;
      this.x = x;
      this.y = y;

      countriesList.forEach(city => {
        const cityName = city.name;
        this.balance[cityName] = 0;
        this.balancePerDay[cityName] = 0;
      })
  
      this.balance[countryName] = INITIAL_CITY_BALANCE;
    }
  
    transferToNeighbours() {
      for (const motif in this.balance) {
        const balanceOfMotif = this.balance[motif];
        const amountToTransfer = Math.floor(balanceOfMotif / REPRESENTATIVE_PORTION);
        if (amountToTransfer > 0) {
          for (const neighbour of this.neighbours) {
            this.balance[motif] -= amountToTransfer;
            neighbour.addBalanceInMotif(motif, amountToTransfer);
          }
        }
      }
    }
  
    addBalanceInMotif(motif, amount) {
      this.balancePerDay[motif] += amount;
    }

    setNeighbours(neighbours) {
      this.neighbours = neighbours;
    }
  
    finalizeBalancePerDay() {
      for (const motif in this.balancePerDay) {
        this.balance[motif] += this.balancePerDay[motif];
        this.balancePerDay[motif] = 0;
      }
  
      if (!this.full) {
        for (const motif in this.balancePerDay) {
          if (this.balance[motif] === 0) {
            return;
          }
        }
        this.full = true;
      }
    }
  }
  
  module.exports = { City };
  