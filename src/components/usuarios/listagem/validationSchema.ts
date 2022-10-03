import * as Yup from 'yup'

const campoObrigatorioMensagem = "Campo obrigatório"
const campoObrigatorioValidation = Yup.string().trim().required(campoObrigatorioMensagem)
const campoObrigatorioIdEmpresa = Yup.object().nullable(true).required(campoObrigatorioMensagem)

export const validationScheme = Yup.object().shape({

    nome: campoObrigatorioValidation,
    //idEmpresa: campoObrigatorioIdEmpresa
})