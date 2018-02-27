// Export the database for components to use.
// If you want to get fancy, use mixins or provide / inject to avoid redundant imports.
var CoinMarketCap = require("node-coinmarketcap")
export const coinMkt = new CoinMarketCap({
  events: true,
  convert: "BRL&limit=0"
})
