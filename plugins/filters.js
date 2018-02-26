import Vue from 'vue'

// Vue.filter('reverse', function (value) {
//   return value.split('').reverse().join('')
// })

Vue.filter('currency', function(value) {
  let val = (value/1).toFixed(2).replace('.', ',')
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
})

Vue.filter('btc', function(value){
  let val = (value/1).toFixed(8).replace('.', ',')
  return val.toString()
})