import { Layout } from 'components'
import { Input } from 'components'
import { useFormik } from 'formik'
import { useState } from 'react'
import { DataTable, DataTablePageParams } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { Page } from 'app/models/common/page'
import { useClassificacaoService } from 'app/services/classificacao.service'
import Router from 'next/router'
import { Classificacao } from 'app/models/classificacao'
import { Grupos } from 'app/models/grupos'
import { useGrupoService } from 'app/services'
import { AutoComplete, AutoCompleteChangeParams, AutoCompleteCompleteMethodParams } from 'primereact/autocomplete'
import { validationScheme } from './validationSchema'

let cS: string | undefined

interface ConsultaClassificacaoForm {
    nome?: string
    idGrupo?: Grupos
    id_grupo?: number
    onSubmit?: (classificacao: Classificacao) => void
}

const formScheme: Classificacao = {
    idGrupo: undefined,
    nome: ''
}

export const ListagemClassificacoes: React.FC<ConsultaClassificacaoForm> = ({
    nome,
    idGrupo,
    id_grupo,
    onSubmit
}) => {

    const grupoService = useGrupoService()
    const [ listaGrupos, setListaGrupos ] = useState<Page<Grupos>>({
        content: [],
        first: 0,
        number: 0,
        size: 0,
        totalElements: 0
    })

    const service = useClassificacaoService()
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ classificacao, setClassificacao ] = useState<Page<Classificacao>>({
        content: [],
        first: 0,
        number: 0,
        size: 10,
        totalElements: 0
    })

    const handleSubmit = (filtro: ConsultaClassificacaoForm) => {
        handlePage(null)
    }

    const {
        handleSubmit: formikSubmit,
        values: filtro,
        handleChange
    } = useFormik<ConsultaClassificacaoForm>({
        onSubmit: handleSubmit,
        initialValues: { nome: '', idGrupo: undefined , id_grupo: 0 }
    })

    const handlePage = (event: DataTablePageParams | any) => {
        setLoading(true)
        service.find(filtro.nome, cS, event?.page, event?.rows)
                .then(result => {
                    setClassificacao({...result, first: event?.first})
                }).finally(() => setLoading(false))
    }

    const deletar = (classificacao: Classificacao) => {
        service.deletar(classificacao.id).then(result => {
            handlePage(null)
        })
    }

    const actionTemplate = (registro: Classificacao) => {
        const url = `/cadastros/classificacoes?id=${registro.id}`
        return (
            <div>
                <Button label="Editar"
                        className="p-button-rounded p-button-info"
                        onClick={e => Router.push(url)}
                        />
                <Button label="Deletar" onClick={event => {
                    confirmDialog({
                        message: "Confirma a exclusão deste registro?",
                        acceptLabel: "Sim",
                        rejectLabel: "Não",
                        accept: () => deletar(registro),
                        header: "Confirmação"
                    })
                }}
                        className="p-button-rounded p-button-danger"/>
            </div>
        )
    }

    const formik = useFormik<Classificacao>({
        initialValues: {...formScheme},
        onSubmit(values, formikHelpers) {
            
        },
        enableReinitialize: true,
        validationSchema: validationScheme
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
        cS = grupoSelecionado.id
        console.log(grupoSelecionado)
    }

    return (
        <Layout titulo="Classificações">
            <form onSubmit={formikSubmit}>
                <div className='p-fluid'>
                    <div className='columns'>
                        <Input label="Nome" id="nome"
                            columnClasses='is-half'
                            autoComplete='off'
                            onChange={handleChange}
                            name="nome" value={filtro.nome} />
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
                                Consultar
                            </button>
                        </div>
                        <div className='control is-link'>
                            <button type='submit'
                                    onClick={e => Router.push("/cadastros/classificacoes")}
                                    className='button is-warning'>
                                Novo
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            <br/>

            <div className='columns'>
                <div className='is-full'>
                    <DataTable value={classificacao.content}
                            totalRecords={classificacao.totalElements}
                            lazy paginator
                            first={classificacao.first}
                            rows={classificacao.size}
                            onPage={handlePage}
                            loading={loading}
                            emptyMessage="Nenhum registro."
                            >
                        <Column field='id' header="Código" />
                        <Column field='nome' header="Classificação" />
                        <Column field='idGrupo.nome' header="Grupo" />
                        <Column body={actionTemplate} />
                    </DataTable>

                </div>

            </div>
        </Layout>
    )
}