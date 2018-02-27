<template>
  <div class='moeda-dialog'>
    <el-button :type='type' size='large' :class='btnClass' @click="open()">
      <slot></slot>
    </el-button>
    <el-dialog
      :visible.sync="visible"
      :title="title"
      width='430px'
      id='moeda-form'
      :append-to-body='true'
      style="padding:0"
      @close='close'>

      <el-form ref="modal-form" :model='form' label-width="140px" :rules="rules">
        <el-form-item label="Moeda" prop='moeda'>
            <el-select v-model="form.moeda" size='large' filterable :default-first-option='true' @change='updateValues' placeholder="Selecione" no-data-text='Sem dados' no-match-text='Nenhum resultado' style="width: 100%;">
              <el-option v-for="option in coinsList" :value="option.symbol" :key="option.id">{{ option.symbol }} <small>{{ option.name }}</small></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label='Valor de Compra' prop='compra'>
          <el-input v-model="form.compra.usd" size='large' class="number" style="width: 100%;">
            <span slot="prepend">U$</span>
          </el-input>
          <el-input v-model="form.compra.btc" size='large' class="number" style="margin-top:5px; width: 100%;">
            <span slot="prepend">BTC</span>
          </el-input>
        </el-form-item>

        <el-form-item label="Quantidade" prop='quantidade'>
            <el-input v-model="form.quantidade" size='large' class="number" style="width: 100%;"></el-input>
            <div v-if='form.moeda!=="" && form.quantidade>0' class='text-right'><small>Equivalencia U$: {{equivalenciaUSD | currency}}</small></div>
        </el-form-item>
    
        <el-form-item label="Exchange" prop='exchange'>
            <el-select v-model="form.exchange" size='large' filterable :default-first-option='true' placeholder="Selecione" no-data-text='Sem dados' no-match-text='Nenhum resultado' style="width: 100%;">
              <el-option v-for="(option, index) in exchangeList" :value="option" :key="index">{{ option }}</el-option>
            </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submit">Salvar</el-button>
          <el-button @click="close">Cancelar</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { coinMkt } from '@/plugins/coinmarketcap'
import * as _ from 'lodash'

export default {
  props: {
    title: {
      type: String
    },

    active: {
      type: Boolean,
      default: false
    },

    moedaId: {
      type: String,
      default: null
    },

    type: {
      type: String,
      default: 'primary'
    },

    btnClass: {
      type: String,
      default: ''
    },
  },

  data () {

      let validators = {
        compra: (rule, value, callback) => {
          if(value.usd <= 0 || value.usd == ''){
            callback(new Error('Favor informar o valor de compra em USD'))
          }
          if(value.btc <= 0 || value.btc == ''){
            callback(new Error('Favor informar o valor de compra em BTC'))
          }
          callback()
        },

        quantidade: (rule, value, callback) => {
          if(value <= 0 || value == ''){
            callback(new Error('Favor informar uma quantidade maior que 0'))
          }
          callback()

        }
      }

      return {
        modal_moeda: false,

        form: {
          moeda: '',
          exchange: '',
          quantidade: 0.00,
          compra: {
            usd : 0.00,
            btc : 0.00
          }
        },

        coinsList: {},
        exchangeList: [
          'BitcoinTrade',
          'BitFinex',
          'Binance',
          'Bittrex',
          'BleuTrade',
          'FoxBit',
        ],

        rules: {
          moeda: [
            { required: true, message:'Campo deve ser preenchido', trigger: 'blur'}
          ],
          exchange: [
            { required: true, message:'Campo deve ser preenchido', trigger: 'blur'}
          ],
          quantidade: [
            { required: true, message:'Campo deve ser preenchido', trigger: 'blur'},
            { validator: validators.quantidade, trigger: 'blur'}
          ],
          compra: [
            { required: true, message:'Campo deve ser preenchido', trigger: 'blur'},
            { validator: validators.compra, trigger: 'blur'}
          ],
        }
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

  computed: {
    equivalenciaUSD: function(){
      return this.form.compra.usd * this.form.quantidade
    },
    visible: {
      get: function(){
        //Retornando dependencia com active e modal_moeda
        if(this.active) {
          this.open()
        }
        return this.modal_moeda
      },
      set: function(value){}
    }
  },

  methods: {

    open () {
      this.modal_moeda = true

      //Editando moeda ja salva
      if(this.moedaId != null){
        this.form = this.$store.getters.moedaById(this.moedaId)
      }
    },

    submit(){
      this.$nextTick(() => {
        this.$refs['modal-form'].validate((valid)=>{
          if(valid){
            this.save()
          }else{
            this.$message.error('Existem erros no formulario')
            return false
          }
        })
      })
    },

    save () {
      //Verifica se a moeda foi identificada, senão não salva
      if(this.form.moeda == ''){
        this.$message.error('Moeda não foi identificada')
        return false
      }

      //salva na store e consequentemente, persiste informação
      this.$store.commit('saveMoeda', _.cloneDeep(this.form))
      this.$message.success('Valor Atualizado')
      this.close()
      this.$emit('change')
    },

    updateValues(){
      if(this.moeda=='') return
      //Recupera valor selecionado e atualiza valores relacionados
      let moeda             = _.find(this.coinsList, {symbol: this.form.moeda})
      this.form.compra.usd  = moeda.price_usd
      this.form.compra.btc  = moeda.price_btc
    },

    close() {
      this.modal_moeda = false
      this.$refs['modal-form'].resetFields();
      this.$emit('close')
    }

  }
}
</script>

<style lang='scss' scoped>

.el-dialog{

  .el-select-item small{
    color: rgba(0,0,0,0.3);
    font-size: 12px;
    display: block;
  }

  .el-input-group__prepend span{
    display: inline-block;
    width: 30px;
    text-align: right;
  }
}
</style>
