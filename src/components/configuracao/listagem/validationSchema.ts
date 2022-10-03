import * as Yup from 'yup'

const campoObrigatorioMensagem = "Campo obrigatório"
const campoObrigatorioValidation = Yup.string().trim().required(campoObrigatorioMensagem)
const campoObrigatorioId = Yup.object().nullable(true).required(campoObrigatorioMensagem)

export const validationScheme = Yup.object().shape({

    empresa: campoObrigatorioId,
    copa: campoObrigatorioId
})