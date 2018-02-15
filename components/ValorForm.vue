<template>
  <span>
    <a href='#' @click="open()"><Icon type="edit" /></a>
    <Modal
        v-model="modal_ajuste"
        title="Ajustar Valor injetado"
        ok-text="Salvar"
        cancel-text="Cancelar"
        @on-ok="save"
        @on-cancel="cancel">
        <Form label-position="left" @submit.native.prevent>
          <FormItem label="Valor">
              <InputNumber v-model="valor" :precision='2' size='large'>
                <span slot="prepend">R$</span>
              </InputNumber>
          </FormItem>
      </Form>
    </Modal>
  </span>
</template>

<script>
    import { mapState } from 'vuex'
    export default {
        props: {},
        data () {
            return {
                modal_ajuste: false,
                valor: 0
            }
        },
        methods: {
            open () {
                this.modal_ajuste = true
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

<style scoped>
  
</style>
