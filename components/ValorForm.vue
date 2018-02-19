<template>
  <span>
    <a href='#' @click="open()"><Icon type="edit" /></a>
    <Modal
        v-model="modal_ajuste"
        title="Ajustar Valor injetado"
        ok-text="Salvar"
        cancel-text="Cancelar"
        @on-ok="save"
        @on-cancel="cancel"
        class-name='modal'
        width='250px'>
        <Form label-position="left">
          <FormItem label="Valor">
              <money ref='valor' v-model="valor" v-bind='{prefix:"R$ "}' class='ivu-input ivu-input-large' @keyup.enter='save'></money>
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
                this.$nextTick(() => this.$refs.valor.$el.focus())
            },
            save () {
                this.$Message.success('Valor Atualizado')
                //salva na store e consequentemente, persiste informação
                this.$store.commit('setValor', this.valor)
                this.modal_ajuste = false
            },
            cancel () {
            }
        }
    }
</script>
