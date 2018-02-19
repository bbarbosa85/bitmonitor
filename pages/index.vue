<template>
  <div class="layout">
      <Layout>
          <Header :style="{position: 'fixed', width: '100%', height:'100px', zIndex:'10'}">
              <Row id='infos'>
                <i-col span='10' class='titulo'>
                  <h1>Rastreador de Moedas <Button shape='circle' icon="refresh" @click="getCoins"></Button></h1>
                </i-col>
                <i-col span='4'>
                  <h4>Dólar</h4>
                  <span><small>R$</small> {{formatPrice(vr_dolar)}} </span>
                </i-col>
                <i-col span='4' class='vr_aplicado'>
                  <h4>Valor Aplicado</h4>
                  <valor-form />
                  <span><small>R$</small> {{formatPrice(valorAplicado)}} </span>
                  <span class='usd'><small>U$</small> {{formatPrice(valorAplicado/vr_dolar)}} </span>
                </i-col>
                <i-col span='4'>
                  <h4>Saldo Atualizado</h4>
                  <span><small>R$</small> {{formatPrice(saldo.brl)}} </span>
                  <span class='usd'><small>U$</small> {{formatPrice(saldo.usd)}} </span>
                </i-col>
                <i-col span='2' class='lucros'>
                  <h4>Lucros</h4>
                  <span :class='this.formatClass(profit.brl)'> {{formatPrice(profit.brl)}} %</span>
                  <span :class='"usd " + this.formatClass(profit.usd)'>{{formatPrice(profit.usd)}} %</span>
                </i-col>
              </Row>
            <moeda-form id='add-moeda' title='Adicionar Moeda' v-on:change='getCoins'/>
          </Header>
          <Content :style="{padding: '10px 50px', margin: '120px 0 0'}">
            <div v-if="table.columns">
              <Table :loading='table.loading' :columns='table.columns' :data='table.coins'></Table>
            </div>
          </Content>
          <Footer class="layout-footer-center text-right" :style="{textAlign: 'right'}">2018 &copy; Batora.net</Footer>
      </Layout>
  </div>
</template>

<script>
import {coinMkt} from '@/plugins/coinmarketcap'
import { mapState } from 'vuex'
import ValorForm from '~/components/ValorForm.vue'
import MoedaForm from '~/components/MoedaForm.vue'
import * as _ from 'lodash'

export default {
  components: {ValorForm, MoedaForm},
  data() {
    return {
      vr_dolar: 0.00,

      saldo: {
        brl: 0.00,
        usd: 0.00,
        btc: 0.00,
      },
      profit: {
        brl: 0.00,
        usd: 0.00,
        btc: 0.00,
      },

      table: {
        loading: false,
        columns: [
          {
            title: 'Moeda',
            key: 'name',
            render: (h, params) => {
              return h('div', [
                  h('span', params.row.symbol),
                  h('small', {class:'btc'}, params.row.name)
              ]);
            },
          },
          {
            title: 'Exchange',
            key: 'exchange',
          },
          {
            title: 'Valor Atual (U$)',
            key: 'priceUSD',
            render: (h, params) => {
                return h('div', [
                    h('span', this.formatPrice(params.row.priceUSD)),
                    h('small', {class:'btc'}, this.formatPrice(params.row.priceBTC, 8))
                ]);
            },
            sortable: true,
            align: 'right',
            width: '150px'
          },
          {
            title: 'Qtd',
            key: 'quantidade',
            sortable: true,
            align: 'right',
            width: '150px'
          },
          {
            title: 'Compra',
            key: 'quantidade',
            sortable: true,
            align: 'right',
            width: '150px',
            render: (h, params) => {
                return h('div', [
                    h('span', this.formatPrice(params.row.compraUSD)),
                    h('small', {class:'btc'}, this.formatPrice(params.row.compraBTC, 8))
                ]);
            },
          },
          {
            title: 'Ganhos',
            key: 'profitUSD',
            sortable: true,
            align: 'right',
            width: '150px',
            render: (h, params) => {
                return h('div', [
                    h('span', {class: this.formatClass(params.row.profitUSD)}, params.row.fProfitUSD),
                    h('small', {class:'btc ' + this.formatClass(params.row.profitBTC)}, params.row.fProfitBTC)
                ]);
            },
          },
          {
            title: 'Total',
            key: 'totalUSD',
            sortable: true,
            align: 'right',
            width: '150px',
            render: (h, params) => {
                return h('div', [
                    h('span', this.formatPrice(params.row.totalUSD)),
                    h('small', {class:'btc'}, this.formatPrice(params.row.totalBTC, 8))
                ]);
            },
          },
          {
            title: ' ',
            align: 'center',
            width: '80px',
            render: (h, params) => {
                return h('div', [
                    h('a', {
                      on: {
                          click: ()=> { this.deleteMoeda(params.row.id) }
                        }
                      }, 
                      [
                        h('i', {class:'ivu-icon ivu-icon-trash-a', style:'font-size:1.5em'})
                      ]
                    ),
                ]);
            },
          },
        ],
        coins: []
      }
    }
  },
  computed: mapState([
    'valorAplicado',
    'moedas'
  ]),
  mounted() {
    this.getCoins()
  },
  methods: {
    getCoins: function() {
      this.loading = true
      this.saldo.brl = 0
      this.saldo.usd = 0
      this.saldo.btc = 0

      let set = []
      //Recupera valores das moedas gravadas em memoria
      coinMkt.multi(coins => {
        for(let m in this.moedas){
          let moeda = _.clone(this.moedas[m])
          let infos = coins.get(moeda.moeda)

          // Calcula e inclui informações na moeda
          moeda.name       = infos.name
          moeda.symbol     = infos.symbol
          moeda.priceUSD   = infos.price_usd
          moeda.profitUSD  = moeda.compraUSD / (infos.price_usd - moeda.compraUSD)
          moeda.fProfitUSD = this.formatPrice(moeda.profitUSD) + '%'
          moeda.priceBTC   = infos.price_btc
          moeda.profitBTC  = (infos.symbol == 'BTC') ? '' : moeda.compraBTC / (infos.price_btc - moeda.compraBTC)
          moeda.fProfitBTC = (moeda.profitBTC) ? this.formatPrice(moeda.profitBTC) + '%':''
          moeda.totalBRL   = infos.price_brl * moeda.quantidade
          moeda.totalUSD   = infos.price_usd * moeda.quantidade
          moeda.totalBTC   = infos.price_btc * moeda.quantidade

          //soma saldo total
          this.saldo.brl   += moeda.totalBRL
          this.saldo.usd   += moeda.totalUSD
          this.saldo.btc   += moeda.totalBTC

          set.push(moeda)
        }
        this.table.coins = set
        this.table.loading = false
      })

      //Recupera valor do dolar baseado no BTC
      coinMkt.get("bitcoin", coin => {
        this.vr_dolar = coin.price_brl / coin.price_usd

        //Conbtabiliza lucros
        let vrAplicadoUsd = this.valorAplicado / this.vr_dolar
        this.profit.usd = ((this.saldo.usd - vrAplicadoUsd) / vrAplicadoUsd) * 100
        this.profit.brl = ((this.saldo.brl - this.valorAplicado) / this.valorAplicado) * 100
      });


    },
    formatPrice(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    formatClass(value){
      if(value==0 || value=='') 
        return ''
      else if(value>0) 
        return 'green'
      else 
        return 'red'
    },
    deleteMoeda(moedaID){
      this.$store.commit('deleteMoeda', moedaID)
      this.getCoins()
    }
  }
}
</script>


<style>
  h1{ color: #FFF; line-height: 90px; }
  h4{ color: rgba(255,255,255,0.5);  line-height: 20px; padding: 20px 0 0;  text-transform: uppercase; font-size: 12px; font-weight: normal; text-align: right; }

  #infos{
    color: #FFF;
    padding: 0;
  }
  #infos > .ivu-col{
    line-height: 1em;
  }
  #infos > .ivu-col > span{
    text-align: right;
    line-height: 30px;
    font-size: 1.3em;
    display: block;
  }
  #infos .vr_aplicado{
    text-align: right;
  }
  #infos .vr_aplicado span{
    color: #F5A623;
    display: inline-block;
  }
  #infos span.usd{
    display: block;
    font-size: 13px;
    line-height: 1em;
    color: rgba(255,255,255,0.5);
  }
  #infos .vr_aplicado a{
    color: #FFF;
    font-size: 0.8em;
    border-bottom: 1px dotted #FFF;
    margin: 10px;
  }
  #infos .vr_aplicado a .ivu-icon{
    -webkit-transform: scale(-1, 1);
    transform: scale(-1, 1);
  }

  #add-moeda {
    display: block;
    position: relative;
    z-index: 5;
    text-align: center;
    top: -25px;
  }
  .v-money{ text-align: right; }
  .green { color: green }
  .red { color: red }

  .ivu-form-item{
    margin-bottom: 15px;
  }
  table div > small{
    display: block;
  }
</style>

