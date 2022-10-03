import * as Yup from 'yup'

const campoObrigatorioMensagem = "Campo obrigatório"
const campoObrigatorioValidation = Yup.string().trim().required(campoObrigatorioMensagem)
const campoObrigatorioEmLista = Yup.object().nullable(true).required(campoObrigatorioMensagem)

export const validationScheme = Yup.object().shape({

    empresa: campoObrigatorioEmLista,
    copa: campoObrigatorioEmLista,
    pontos_cravada: campoObrigatorioValidation,
    pontos_acerto: campoObrigatorioValidation,
    pontos_erro: campoObrigatorioValidation
})