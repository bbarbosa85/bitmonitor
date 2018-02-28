<template>
  <div id='valor-dialog'>
    <a href='#' @click="open"><i class='el-icon-edit' /></a>
    <el-dialog
        :visible.sync="modal_ajuste"
        title="Ajustar Valor Aplicado"
        width='280px'
        :append-to-body='true'>

        <el-form label-position="left" @submit='save'>
          <el-form-item label="Valor">
            <el-input v-model="valor" ref='focus' size='large' @keyup.enter='save' v-currency>
                <span slot="prepend">R$</span>
            </el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel()">Cancelar</el-button>
            <el-button type="primary" @click="save()">Salvar</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
    import { mapState } from 'vuex'
    import {currencyMixin} from '@/plugins/mixins'
    export default {
        props: {},
        mixins: [currencyMixin],
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
                this.$nextTick(() => this.$refs.focus.$el.querySelector('input').focus())
            },
            save () {
                let val = this.currencyValue(this.valor)
                if(val != this.$store.state.valorAplicado){
                    //salva na store e consequentemente, persiste informação
                    this.$store.commit('setValor', val)
                    this.$message.success('Valor Atualizado')
                }
                this.modal_ajuste = false
            },
            cancel () {
                this.modal_ajuste = false
            }
        }
    }
</script>

<style lang='scss' scoped>
    #valor-dialog{
        display: inline;
        text-align: left;

        a {
            font-size: 1.4em;
            color: white;
            border-bottom: 1px dotted white;
            margin: 0 10px;
        }
    }
</style>

