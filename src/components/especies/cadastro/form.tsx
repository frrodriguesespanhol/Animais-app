import { Especie } from 'app/models/especies'
import { Input } from 'components'
import { useFormik } from 'formik'
import { validationScheme } from './validationSchema'
import Router from 'next/router'
import { useClassificacaoService } from 'app/services'
import { Classificacao } from 'app/models/classificacao'
import { Page } from 'app/models/common/page'
import { useState } from 'react'
import { AutoComplete, AutoCompleteChangeParams, AutoCompleteCompleteMethodParams } from 'primereact/autocomplete'

interface EspecieFormProps {
    especie: Especie
    onSubmit: (especie: Especie) => void
}

const formScheme: Especie = {
    idClassificacao: undefined,
    nome: ''
}

export const EspecieForm: React.FC<EspecieFormProps> = ({
    especie,
    onSubmit
}) => {

    const formik = useFormik<Especie>({
        initialValues: {...formScheme, ...especie},
        onSubmit,
        enableReinitialize: true,
        validationSchema: validationScheme
    })

    const classificacaoService = useClassificacaoService()
    const [ listaClassificacoes, setListaClassificacoes ] = useState<Page<Classificacao>>({
        content: [],
        first: 0,
        number: 0,
        size: 0,
        totalElements: 0
    })

    const handleClassificacaoAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        classificacaoService
            .find_combo(nome, "", 0, 20)
            .then(classificacoes => setListaClassificacoes(classificacoes))
    }

    const handleClassificacaoChange = (e: AutoCompleteChangeParams) => {
        const classificacaoSelecionada: Classificacao = e.value
        formik.setFieldValue("idClassificacao", classificacaoSelecionada)
        console.log(classificacaoSelecionada)
    }

    return (
        <form onSubmit={formik.handleSubmit}>
            {formik.values.id &&
                <div className='columns'>
                    <Input id="id"
                        name="id"
                        label="Código: "
                        autoComplete='off'
                        disabled
                        columnClasses='is-half'
                        value={formik.values.id}
                    />
                </div>
            }

            <div className='p-fluid'>
                <div className='columns'>
                    <Input id="nome"
                        name="nome"
                        label="Espécie: *"
                        autoComplete='off'
                        columnClasses='is-full'
                        value={formik.values.nome}
                        onChange={formik.handleChange}
                        error={formik.errors.nome}
                    />
                </div>

                <div className='p-field'>
                            <label htmlFor="classificacao">Classificação: *</label>
                            <AutoComplete
                                suggestions={listaClassificacoes.content}
                                completeMethod={handleClassificacaoAutoComplete}
                                value={formik.values.idClassificacao}
                                field="nome"
                                id="idClassificacao"
                                name="idClassificacao"
                                onChange={handleClassificacaoChange}
                                />
                            <small className='p-error p-d-block'>
                                {formik.errors.idClassificacao}
                            </small>
                    </div>

                <div className='field is-grouped'>
                    <div className='control is-link'>
                        <button type='submit' className='button is-success'>
                            { formik.values.id ? "Atualizar" : "Salvar" }
                        </button>
                    </div>
                    
                    <div className='control is-link'>
                        <button type='button'
                                onClick={e => Router.push("/consultas/especies")}
                                className='button'>
                            Voltar
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}