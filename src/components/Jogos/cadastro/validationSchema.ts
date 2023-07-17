import * as Yup from 'yup'

const campoObrigatorioMensagem = "Campo obrigatório"
const campoObrigatorioValidation = Yup.string().trim().required(campoObrigatorioMensagem)
const campoObrigatorioEmLista = Yup.object().nullable(true).required(campoObrigatorioMensagem)

export const validationScheme = Yup.object().shape({

    eq1: campoObrigatorioEmLista,
    eq2: campoObrigatorioEmLista,
    cidade: campoObrigatorioEmLista,
    data_hora: campoObrigatorioValidation,
    fase: campoObrigatorioEmLista,
    campeonato: campoObrigatorioEmLista,

})