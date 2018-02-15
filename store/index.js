import createPersistedState from 'vuex-persistedstate'

export const state = () => ({
    valorAplicado: 0,
    moedas: []
})

export const mutations = {
  setValor(state, valor) {
    //atualiza no status
    state.valorAplicado = valor
  }
}