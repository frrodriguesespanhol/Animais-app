import { Classificacao } from 'app/models/classificacao'
import { Input } from 'components'
import { useFormik } from 'formik'
import { validationScheme } from './validationSchema'
import Router from 'next/router'
import { useGrupoService } from 'app/services'
import { Grupos } from 'app/models/grupos'
import { Page } from 'app/models/common/page'
import { useState } from 'react'
import { AutoComplete, AutoCompleteChangeParams, AutoCompleteCompleteMethodParams } from 'primereact/autocomplete'

interface ClassificacaoFormProps {
    classificacao: Classificacao
    onSubmit: (classificacao: Classificacao) => void
}

const formScheme: Classificacao = {
    idGrupo: undefined,
    nome: ''
}

export const ClassificacaoForm: React.FC<ClassificacaoFormProps> = ({
    classificacao,
    onSubmit
}) => {

    const formik = useFormik<Classificacao>({
        initialValues: {...formScheme, ...classificacao},
        onSubmit,
        enableReinitialize: true,
        validationSchema: validationScheme
    })

    const grupoService = useGrupoService()
    const [ listaGrupos, setListaGrupos ] = useState<Page<Grupos>>({
        content: [],
        first: 0,
        number: 0,
        size: 0,
        totalElements: 0
    })

    const handleGrupoAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        grupoService
            .find(nome, 0, 20)
            .then(grupos => setListaGrupos(grupos))
    }

    const handleGrupoChange = (e: AutoCompleteChangeParams) => {
        const grupoSelecionado: Grupos = e.value
        formik.setFieldValue("idGrupo", grupoSelecionado)
        console.log(grupoSelecionado)
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
                        label="Classificação: *"
                        autoComplete='off'
                        columnClasses='is-full'
                        value={formik.values.nome}
                        onChange={formik.handleChange}
                        error={formik.errors.nome}
                    />
                </div>

                <div className='p-field'>
                        <label htmlFor="grupo">Grupo: *</label>
                        <AutoComplete
                            suggestions={listaGrupos.content}
                            completeMethod={handleGrupoAutoComplete}
                            value={formik.values.idGrupo}
                            field="nome"
                            id="idGrupo"
                            name="idGrupo"
                            onChange={handleGrupoChange}
                            />
                        <small className='p-error p-d-block'>
                            {formik.errors.idGrupo}
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
                                onClick={e => Router.push("/consultas/classificacoes")}
                                className='button'>
                            Voltar
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}