import { Layout } from 'components'
import { Input } from 'components'
import { useFormik } from 'formik'
import { useState } from 'react'
import { DataTable, DataTablePageParams } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { Page } from 'app/models/common/page'
import { useEspecieService } from 'app/services/especie.service'
import Router from 'next/router'
import { Especie } from 'app/models/especies'
import { Classificacao } from 'app/models/classificacao'
import { useClassificacaoService } from 'app/services'
import { AutoComplete, AutoCompleteChangeParams, AutoCompleteCompleteMethodParams } from 'primereact/autocomplete'
import { validationScheme } from './validationSchema'

let cS: string | undefined

interface ConsultaEspecieForm {
    nome?: string
    idClassificacao?: Classificacao
    id_classificacao?: number
    onSubmit?: (especie: Especie) => void
}

const formScheme: Especie = {
    idClassificacao: undefined,
    nome: ''
}

export const ListagemEspecies: React.FC<ConsultaEspecieForm> = ({
    nome,
    idClassificacao,
    id_classificacao,
    onSubmit
}
) => {


    const classificacaoService = useClassificacaoService()
    const [ listaClassificacoes, setListaClassificacoes ] = useState<Page<Classificacao>>({
        content: [],
        first: 0,
        number: 0,
        size: 0,
        totalElements: 0
    })

    const service = useEspecieService()
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ especie, setEspecie ] = useState<Page<Especie>>({
        content: [],
        first: 0,
        number: 0,
        size: 10,
        totalElements: 0
    })

    const handleSubmit = (filtro: ConsultaEspecieForm) => {
        handlePage(null)
    }

    const {
        handleSubmit: formikSubmit,
        values: filtro,
        handleChange
    } = useFormik<ConsultaEspecieForm>({
        onSubmit: handleSubmit,
        initialValues: { nome: '', idClassificacao: undefined , id_classificacao: 0 }
    })

    const handlePage = (event: DataTablePageParams | any) => {
        setLoading(true)
        service.find(filtro.nome, event?.page, event?.rows)
                .then(result => {
                    setEspecie({...result, first: event?.first})
                }).finally(() => setLoading(false))
    }

    const deletar = (especie: Especie) => {
        service.deletar(especie.id).then(result => {
            handlePage(null)
        })
    }

    const actionTemplate = (registro: Especie) => {
        const url = `/cadastros/especies?id=${registro.id}`
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

    const formik = useFormik<Especie>({
        initialValues: {...formScheme},
        onSubmit(values, formikHelpers) {
            
        },
        enableReinitialize: true,
        validationSchema: validationScheme
    })

    const handleClassificacaoAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        classificacaoService
            .find_combo(nome, 0, 20)
            .then(classificacoes => setListaClassificacoes(classificacoes))
    }

    const handleClassificacaoChange = (e: AutoCompleteChangeParams) => {
        const classificacaoSelecionada: Classificacao = e.value
        formik.setFieldValue("idClassificacao", classificacaoSelecionada)
        cS = classificacaoSelecionada.id
        console.log(classificacaoSelecionada)
    }


    return (
        <Layout titulo="Espécies">
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
                                Consultar
                            </button>
                        </div>
                        <div className='control is-link'>
                            <button type='submit'
                                    onClick={e => Router.push("/cadastros/especies")}
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
                    <DataTable value={especie.content}
                            totalRecords={especie.totalElements}
                            lazy paginator
                            first={especie.first}
                            rows={especie.size}
                            onPage={handlePage}
                            loading={loading}
                            emptyMessage="Nenhum registro."
                            >
                        <Column field='id' header="Código" />
                        <Column field='nome' header="Espécie" />
                        <Column field='idClassificacao.nome' header="Classificação" />
                        <Column body={actionTemplate} />
                    </DataTable>

                </div>

            </div>
        </Layout>
    )
}