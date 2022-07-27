import * as Yup from 'yup'

export const validationScheme = Yup.object().shape({
    nome:  Yup.string().trim().required("Campo Obrigatório."),
    idcopa: Yup.object().nullable(true).required("Campo Obrigatório.")
})