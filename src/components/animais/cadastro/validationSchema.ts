import * as Yup from 'yup'

const campoObrigatorioMensagem = "Campo obrigatório"
const campoObrigatorioValidation = Yup.string().trim().required(campoObrigatorioMensagem)
const campoObrigatorioIds = Yup.object().nullable(true).required(campoObrigatorioMensagem)

export const validationScheme = Yup.object().shape({

    data: campoObrigatorioValidation,
    idGrupoAnimal: campoObrigatorioIds,
    idClassificacaoAnimal: campoObrigatorioIds,
    idEspecieAnimal: campoObrigatorioIds,
    localizacao: campoObrigatorioValidation,
    cadastradopor: campoObrigatorioValidation,
    estado: campoObrigatorioValidation,
    comentario: campoObrigatorioValidation
    
})