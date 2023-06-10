const getCountry = (args) => ({
  name: args[0],
  ll: { x: parseInt(args[1]), y: parseInt(args[2]) },
  ur: { x: parseInt(args[3]), y: parseInt(args[4]) },
})

module.exports = {getCountry}