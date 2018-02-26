import createPersistedState from 'vuex-persistedstate'
import * as _ from 'lodash'

export const state = () => ({
    valorAplicado: 0,
    moedas: []
})

export const actions = {
}

export const getters = {
  moedaById: (state) => (moedaId) => {
    let m = _.find(state.moedas, function(moeda) {
      return moeda.id === moedaId;
    });

    return _.cloneDeep(m)
  }
}

export const mutations = {
  //Atualiza valor inicial
  setValor(state, valor) {
    state.valorAplicado = valor
  },
  
  //Salva moeda na lista, salvando nova ou atualizando os valores salvos em uma moeda com ID pre existente
  saveMoeda(state, valor) {
    //Editando
    if(valor.id){
      //recupera indice da moeda pelo ID
      let m = _.findIndex(state.moedas, function(moeda) {
        return moeda.id === valor.id;
      });
      //substitui o conteudo na posicao
      state.moedas[m] = valor
    }
    //Salvando nova
    else{
      valor.id  = Math.random().toString(36).substring(7)
      state.moedas.push(valor)
    }
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