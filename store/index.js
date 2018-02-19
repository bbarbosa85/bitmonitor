import createPersistedState from 'vuex-persistedstate'
import * as _ from 'lodash'

export const state = () => ({
    valorAplicado: 0,
    moedas: []
})

export const actions = {
}

export const mutations = {
  //Atualiza valor inicial
  setValor(state, valor) {
    state.valorAplicado = valor
  },

  //Insere moeda na lista de verificações
  pushMoeda(state, valor) {
    state.moedas.push(valor)
  },
  
  //Remove moeda da lista
  deleteMoeda(state, moedaID){
    if(moedaID=='') return
    //Remove moeda da lista a partir do ID
    let moeda = _.remove(state.moedas, (m)=>{
      return m.id == moedaID
    })
  }
}