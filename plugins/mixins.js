let Inputmask = process.browser ? require("inputmask") : ''

/** 
 * Trata substituição de valores numericos
 */
let floatValue = (val) => {
  //verifica se e numero
  if(!isNaN(parseFloat(val)) && isFinite(val)){
    return parseFloat(val)
  }else{
    //substitui ocorrencia de caracteres nao numericos
    return parseFloat(val.replace(/[^0-9-,]/g, '').replace(',', '.'))
  }
}

export const currencyMixin = {
  methods: {
    currencyValue(val){
     return floatValue(val) 
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
      return floatValue(val)
    }
  },
  directives: {
    btc(el, binding) {
      const $el = el.getElementsByTagName("input")[0]
      if(!$el || $el.dataset.btc) return
      //marcando elemento como já tendo evento
      $el.dataset.btc = true
    
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