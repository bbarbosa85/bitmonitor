<template>
  <span>
    <Button type="primary" @click="open()">Novo</Button>
    <Modal
        v-model="modal_moeda"
        :title="title"
        ok-text="Salvar"
        cancel-text="Cancelar"
        @on-ok="save"
        @on-cancel="cancel">
        <Form label-position="top">
          <Row>
            <i-col span='12'>
              <FormItem label="Moeda">
                  <i-select v-model="moeda" size='large' style="width:200px">
                    <Option v-for="item in coins" :value="item.symbol" :key="item.id">{{ item.name }}</Option>
                  </i-select>
              </FormItem>
            </i-col>
          </Row>
      </Form>
    </Modal>
  </span>
</template>

<script>
import { mapState } from 'vuex'
import {coinMkt} from '@/plugins/coinmarketcap'

export default {
  props: {
    title: 'string'
  },
  data () {
      return {
        modal_moeda: false,
        moeda: 0
      }
  },
  computed: {
    coins: () => {
      let coins = {}
      coinMkt.getAll((data)=>{
        if(data){
          coins = data
          console.log(coins)
        }
      })
      return coins
    }
  },
  methods: {
      open () {
        this.modal_moeda = true
        this.valor = this.$store.state.valorAplicado
      },
      save () {
        this.$Message.success('Valor Atualizado')
        //salva na store e consequentemente, persiste informação
        this.$store.commit('setValor', this.valor)
      },
      cancel () {
      }
  }
}
</script>
