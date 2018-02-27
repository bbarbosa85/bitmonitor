<template>
  <el-container>
    <el-header height='100px'>
      <el-row id='infos' :gutter="30" align='middle'>
        <el-col :xl='14' :lg='10' :xs='24' :sm='6' class='titulo'>
          <h1>Rastreador de Moedas <el-button icon="el-icon-refresh" @click="getCoins" :loading='table.loading' style="margin-left:50px;" class='circle'></el-button></h1>
        </el-col>
        <el-col :xl='3' :lg='4' :xs='12' :sm='4'>
          <h4>Dólar</h4>
          <span><small>R$</small> {{vr_dolar | currency}} </span>
        </el-col>
        <el-col :xl='3' :lg='4' :xs='12' :sm='5' class='vr_aplicado'>
          <h4>Valor Aplicado</h4>
          <valor-form /> 
          <span><small>R$</small> {{valorAplicado | currency}} </span>
          <span class='usd'><small>U$</small> {{valorAplicado/vr_dolar | currency}} </span>
        </el-col>
        <el-col :xl='2' :lg='3' :xs='12' :sm='5'>
          <h4>Saldo Atualizado</h4>
          <span><small>R$</small> {{saldo.brl | currency}} </span>
          <span class='usd'><small>U$</small> {{saldo.usd | currency}} </span>
        </el-col>
        <el-col :xl='2' :lg='3' :xs='12' :sm='4' class='lucros'>
          <h4>Lucros</h4>
          <span :class='this.formatClass(profit.brl)'> {{profit.brl | currency}}<small>%</small></span>
        </el-col>
      </el-row>
      <moeda-form id='add-moeda' title='Adicionar Moeda' v-on:change='getCoins' btn-class='circle'>
        <i class='el-icon-plus' style='font-size: 1.2em'></i>
      </moeda-form>
    </el-header>
    

    <el-main :style="{margin: '120px 0 0'}">

      <el-table v-loading='table.loading' :data='table.coins' :height='600' style="width: 100%" border stripe :default-sort = "{prop: 'name', order: 'ascending'}" @row-dblclick='editMoeda'>
        
        <!-- Exchange -->
        <el-table-column prop='exchange' label='Exchange' sortable sort-by="[exchange, name]"/>

        <!-- Moeda -->
        <el-table-column prop='name' label='Moeda' sortable sort-by="name">
          <template slot-scope='scope'>
            <div>
              <span>{{scope.row.symbol}}</span>
              <small class='btc'>{{scope.row.name}}</small>
            </div>
          </template>
        </el-table-column>
        
        <!-- Quantidade -->
        <el-table-column prop='quantidade' label='Qtd' align='right' sortable sort-by="[quantidade, name]" />

        <!-- Valor de Compra -->
        <el-table-column label='Valor Comprado' align='right' sortable sort-by="[compra.usd, name]" >
          <template slot-scope='scope'>
            <div>
              <span><small>U$</small> {{scope.row.compra.usd | currency}}</span>
              <small v-if='scope.row.symbol!=="BTC"' class='btc'><small>BTC</small> {{scope.row.compra.btc | btc}}</small>
            </div>
          </template>
        </el-table-column>

        <!-- Valor -->
        <el-table-column label='Valor Atual' sortable align='right'>
          <template slot-scope='scope'>
            <div>
              <span><small>U$</small>&nbsp;<span :class='formatClass(scope.row.profitUSD)'>{{scope.row.priceUSD | currency}}</span></span>
              <small v-if='scope.row.symbol!=="BTC"' :class='"btc " + formatClass(scope.row.profitBTC)'><small>BTC</small> {{scope.row.priceBTC | btc}}</small>
            </div>
          </template>
        </el-table-column>

        <!-- Ganhos -->
        <el-table-column label='Ganhos' sortable sort-by="[profitUSD, profitBTC, name]" align='right' width='100px'>
          <template slot-scope='scope'>
            <div>
              <span :class='formatClass(scope.row.profitUSD)'> {{scope.row.fProfitUSD}} </span>
              <small :class='"btc " + formatClass(scope.row.profitBTC)'> {{scope.row.fProfitBTC}} </small>
            </div>
          </template>
        </el-table-column>

        <!-- Total -->
        <el-table-column label='Total' sortable sort-by="[totalUSD, name]" align='right' prop='total'>
          <template slot-scope='scope'>
            <div>
              <span><small>U$</small> {{scope.row.totalUSD | currency}}</span>
              <small class='btc'><small>BTC</small> {{scope.row.totalBTC | btc}}</small>
            </div>
          </template>
        </el-table-column>

        <!-- Ações -->
        <el-table-column align='center' width='50px'>
          <template slot-scope="scope">
              <moeda-form title='Adicionar Moeda' v-on:change='getCoins' v-on:close='scope.row.active=false' :active='scope.row.active' type='text' style='display:inline' :moedaId='scope.row.id'>
                <i class='el-icon-edit' style='font-size: 1.2em'></i>
              </moeda-form>
          </template>
        </el-table-column>

        <el-table-column align='center' width='50px'>
          <template slot-scope='scope'>
              <el-popover
                ref="delete_pop"
                placement="top"
                width="200"
                v-model="scope.row.popdelete">
                <p>Tem certeza que deseja apagar <i>{{scope.row.quantidade}} {{scope.row.symbol}}</i> ?</p>
                <div style="text-align: right; margin: 0">
                  <el-button type="text" @click="scope.row.popdelete = false">Não</el-button>
                  <el-button type="danger" @click="scope.row.popdelete = false; deleteMoeda(scope.row.id)">Apagar</el-button>
                </div>
              </el-popover>

              <a v-popover:delete_pop><i class='el-icon-delete' style='font-size: 1.2em'></i></a>
          </template>
        </el-table-column>

        <span slot="empty">Nenhuma moeda encontrada</span>

      </el-table>
    </el-main>
    <el-footer class="layout-footer-center text-right" :style="{textAlign: 'right'}">2018 &copy; Batora.net</el-footer>    
  </el-container>
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

      table: {
        loading: true,
        coins: []
      }
    }
  },
  computed: {
    //Conbtabiliza lucros
    profit(){
      let vrAplicadoUsd = this.valorAplicado / this.vr_dolar
      return {
        brl: (vrAplicadoUsd > 0) ? ((this.saldo.brl / this.valorAplicado) - 1) * 100 : 0,
        usd: (vrAplicadoUsd > 0) ? ((this.saldo.usd / vrAplicadoUsd) - 1) * 100 : 0
      }
    },

    ...mapState([
      'valorAplicado',
      'moedas'
    ])
  },

  mounted() {
    //inicializa dados de moedas em memoria
    this.getCoins()
  },

  methods: {
    getCoins: function() {
      this.table.loading = true

      let set   = []
      let saldo = {
        brl: 0,
        usd: 0,
        btc: 0
      }

      //Recupera valores das moedas gravadas em memoria
      coinMkt.multi(coins => {
        for(let m in this.moedas){
          let moeda = _.clone(this.moedas[m])

          if(moeda.moeda==''){
            console.error('Falha ao carregar moedas: Moeda não informada c/ id ' + moeda.id)
            return
          }
          let infos = coins.get(moeda.moeda)

          if(infos == undefined){
            console.log(coins.data)
            console.error('Falha ao carregar dados da moeda', moeda)
            return
          } 

          // Calcula e inclui informações na moeda
          moeda.name       = infos.name
          moeda.symbol     = infos.symbol
          moeda.priceUSD   = infos.price_usd
          moeda.profitUSD  = ((moeda.priceUSD / moeda.compra.usd) - 1) * 100
          moeda.fProfitUSD = this.$options.filters.currency(moeda.profitUSD) + '%'
          moeda.priceBTC   = infos.price_btc
          moeda.profitBTC  = (infos.symbol === 'BTC') ? '' : ((moeda.priceBTC / moeda.compra.btc) - 1) * 100
          moeda.fProfitBTC = (infos.symbol === 'BTC') ? '' : this.$options.filters.currency(moeda.profitBTC) + '%'
          moeda.totalBRL   = infos.price_brl * moeda.quantidade
          moeda.totalUSD   = infos.price_usd * moeda.quantidade
          moeda.totalBTC   = infos.price_btc * moeda.quantidade
          moeda.popdelete  = false
          moeda.active     = false

          //soma saldo total
          saldo.brl   += moeda.totalBRL
          saldo.usd   += moeda.totalUSD
          saldo.btc   += moeda.totalBTC

          set.push(moeda)
        }
        this.table.coins    = set
        this.saldo          = saldo
        this.table.loading  = false
      })

      //Recupera valor do dolar baseado no BTC
      coinMkt.get("bitcoin", coin => {
        this.vr_dolar = coin.price_brl / coin.price_usd
      });


    },
    
    formatClass(value){
      if(value==0 || value=='') 
        return ''
      else if(value>0) 
        return 'green'
      else 
        return 'red'
    },

    editMoeda(row, event){
      console.log(row)
      row.active = true
    },

    deleteMoeda(moedaID){
      this.$store.commit('deleteMoeda', moedaID)
      this.getCoins()
      this.$message({
        type: 'success',
        message: 'Moeda removida com sucesso'
      })
    },

  }
}
</script>


<style lang="scss" scoped>
  h1{ color: #FFF; line-height: 60px; margin: 0; text-align: left; }
  h4{ color: rgba(255,255,255,0.5);  line-height: 20px; margin: 0;  text-transform: uppercase; font-size: 12px; font-weight: normal; text-align: right; }

  .el-header{
    background-color: #576271;
    color: #333;
    width: 100%;
    position: fixed;
    z-index: 10;
  }

  #infos{
    color: #FFF;
    padding: 0;

    > .el-col{
      line-height: 1em;
      padding-top: 10px;
      padding-bottom: 10px;
      margin: 10px 0;

      > span{
        text-align: right;
        line-height: 25px;
        font-size: 1.3em;
        display: block;
      }

    }

    .lucros{
      border-left: 1px solid rgba(255,255,255,0.2);

      h4, 
      &.el-col > span {
        text-align: left;
      }
      &.el-col > span {
        font-size: 2.5em;
        text-shadow: 0 1px 5px rgba(0,0,0,0.8);
        padding-top: 6px;

        small{
          font-size: 0.6em;
        }
      }
    }

    .vr_aplicado{
      text-align: right;
      
      > span{
        color: #F5A623;
        display: inline-block;
      }

      a{
        color: #FFF;
        font-size: 0.8em;
        border-bottom: 1px dotted #FFF;
        margin: 10px;

        .el-icon{
          -webkit-transform: scale(-1, 1);
          transform: scale(-1, 1);
        }
      }
    }

    span.usd{
      display: block;
      font-size: 13px;
      line-height: 1em;
      color: rgba(255,255,255,0.5);
    }
  }

  #add-moeda {
    display: block;
    position: relative;
    z-index: 5;
    text-align: center;
    top: -25px;
  }

  .el-form-item{
    margin-bottom: 15px;
  }

  .green { color: green !important }
  .red { color: red !important }

  table div > small{
    display: block;
  }

  table div span > small,
  table div small small {
    color: rgba(0,0,0,0.3);
  }
</style>