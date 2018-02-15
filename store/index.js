import createPersistedState from 'vuex-persistedstate'

export const state = () => ({
    valorAplicado: 0,
    moedas: []
})

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
  deleteMoeda(state, moeda){

  }
}