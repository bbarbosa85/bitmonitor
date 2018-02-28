let Inputmask = process.browser ? require("inputmask") : ''

export const currencyMixin = {
  methods: {
    currencyValue(val){
      return parseFloat(val.replace(/[^0-9-,]/g, '').replace(',', '.'))
    }
  },
  directives: {
    currency(el, binding) {
      const $el = el.getElementsByTagName("input")[0]
      if(!$el || $el.dataset.currency) return
      //marcando elemento como já tendo evento
      $el.dataset.currency = true
    
      // Como usar: https://github.com/RobinHerbots/Inputmask
      Inputmask("numeric", {
        radixPoint: ",",
        groupSeparator: ".",
        digits: 2,
        autoGroup: true,
        prefix: '', //No Space, this will truncate the first character
        rightAlign: true,
        oncleared: function () { self.Value(''); }
      }).mask($el)
    }
  }
}

export const btcMixin = {
  methods: {
    btcValue(val){
      return parseFloat(val.replace(/[^0-9-,]/g, '').replace(',', '.'))
    }
  },
  directives: {
    btc(el, binding) {
      const $el = el.getElementsByTagName("input")[0]
      if(!$el || $el.dataset.currency) return
      //marcando elemento como já tendo evento
      $el.dataset.currency = true
    
      // Como usar: https://github.com/RobinHerbots/Inputmask
      Inputmask("numeric", {
        radixPoint: ",",
        groupSeparator: ".",
        digits: 8,
        autoGroup: true,
        prefix: '', //No Space, this will truncate the first character
        rightAlign: true,
        oncleared: function () { self.Value(''); }
      }).mask($el)
    }
  }
}