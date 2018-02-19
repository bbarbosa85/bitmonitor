<template>
  <span>
    <h2><Button type='primary' size='large' shape='circle' icon="plus" @click="open()"></Button></h2>
    <Modal
        v-model="modalMoeda"
        :title="title"
        ok-text="Salvar"
        cancel-text="Cancelar"
        @on-ok="save"
        @on-cancel="clean"
        class-name='moedaform'
        width='410px'>
        <Form ref="moedaForm" :label-width="140">
          <Row>
            <i-col>
            <FormItem label="Moeda">
                <i-select ref='moeda' v-model="moeda" size='large' filterable @on-change='updateValues()'>
                  <Option v-for="option in coinsList" :value="option.symbol" :key="option.id">{{ option.symbol }} <small>{{ option.name }}</small></Option>
                </i-select>
            </FormItem>
            <FormItem label="Quantidade Adiquirida">
                <money v-model="qtd" v-bind='{precision: 8, prefix:moeda + " "}' class='ivu-input ivu-input-large'></money>
            </FormItem>
          
              <FormItem label="Exchange">
                  <i-select v-model="exchange" size='large' filterable>
                    <Option v-for="(option, index) in exchangeList" :value="option" :key="index">{{ option }}</Option>
                  </i-select>
              </FormItem>
            </i-col>
          </Row>
          <Row style='background-color: #fbfbfb'>
            <i-col>
              <FormItem label='Valor de Compra'>
                  <money v-model="compra.usd" v-bind="{prefix:'U$ ', precision: 2}" class='ivu-input ivu-input-large' ></money>
                  <money v-model="compra.btc" v-bind="{prefix:'BTC ', precision: 8}" class='ivu-input ivu-input-large' style="margin-top:5px"></money>
              </FormItem>
            </i-col>
          </Row>
      </Form>
    </Modal>
  </span>
</template>

<script>
import { mapState } from 'vuex'
import { coinMkt } from '@/plugins/coinmarketcap'
import * as _ from 'lodash'

export default {
  props: {
    title: {
      type: String
    }
  },
  data () {
      return {
        modalMoeda: false,
        moeda: '',
        exchange: '',
        qtd: 0.00,
        compra: {
          usd : 0.00,
          btc : 0.00
        },

        coinsList: {},
        exchangeList: [
          'Binance',
          'BitFinex',
          'BitcoinTrade',
          'Bittrex',
          'FoxBit',
        ]
      }
  },
  mounted: function(){
    //Anota moedas do servidor remoto
    coinMkt.getAll((data)=>{
      if(data){
        this.coinsList = data
      }
    })
  },
  methods: {
    open () {
      this.modalMoeda = true
    },
    save () {
      this.$Message.success('Valor Atualizado')
      //salva na store e consequentemente, persiste informação
      this.$store.commit('pushMoeda', {
        'id':       Math.random().toString(36).substring(7),
        'moeda':    this.moeda,
        'exchange': this.exchange,
        'quantidade': this.qtd,
        'compraUSD': this.compra.usd,
        'compraBTC': this.compra.btc,
      })
      this.clean();
      this.$emit('change')
    },
    clean() {
      this.moeda      = ''
      this.exchange   = ''
      this.qtd        = 0.00
      this.compra.usd = 0.00
      this.compra.btc = 0.00
    },
    updateValues(){
      if(this.moeda=='') return
      //Recupera valor selecionado e atualiza valores relacionados
      let moeda = _.find(this.coinsList, {symbol: this.moeda})
      this.compra.usd = moeda.price_usd
      this.compra.btc = moeda.price_btc
    }
  }
}
</script>

<style scoped>
.moedaform .ivu-modal-body{
  padding: 0 !important;
}
.moedaform .ivu-modal-body .ivu-row{
  padding: 16px 16px 0;
}
.moedaform .ivu-modal-body .ivu-row.destaque{
  background-color: #2d8cf0;
}
.moedaform .ivu-modal-body .ivu-row.destaque label{
  color: #FFF;
  font-weight: bold;
}
.moedaform .ivu-select-item small{
  color: rgba(0,0,0,0.3);
  font-size: 12px;
  display: block;
}
</style>
