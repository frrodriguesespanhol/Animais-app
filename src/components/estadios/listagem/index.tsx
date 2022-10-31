import { Cidade } from 'app/models/cidades'
import { Layout } from 'components'
import { Input } from 'components'
import { useFormik } from 'formik'
import { useState } from 'react'
import { DataTable, DataTablePageParams } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { validationScheme } from './validationSchema'
import { Page } from 'app/models/common/page'
import { useEstadioService, useCidadeService } from 'app/services'
import Router from 'next/router'
import { Estadio } from 'app/models/estadios'
import { AutoComplete, AutoCompleteChangeParams, AutoCompleteCompleteMethodParams } from 'primereact/autocomplete'

let cS: string | undefined

interface ConsultaEstadiosForm {
    nome?: string
    idCidade?: Cidade
    id_cidade?: number
    onSubmit?: (estadio: Estadio) => void
}

const formScheme: Estadio = {
    idCidade: undefined,
    nome: ''
}

export const ListagemEstadios: React.FC<ConsultaEstadiosForm> = ({
        nome,
        idCidade,
        id_cidade,
        onSubmit
    }) => {

    const cidadeService = useCidadeService()
    const [ listaCidades, setListaCidades ] = useState<Page<Cidade>>({
        content: [],
        first: 0,
        number: 0,
        size: 0,
        totalElements: 0
    })

    const service = useEstadioService()
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ estadios, setEstadios ] = useState<Page<Estadio>>({
        content: [],
        first: 0,
        number: 0,
        size: 10,
        totalElements: 0
    })

    const handleSubmit = (filtro: ConsultaEstadiosForm) => {
        handlePage(null)
    }

    const {
        handleSubmit: formikSubmit,
        values: filtro,
        handleChange
    } = useFormik<ConsultaEstadiosForm>({
        onSubmit: handleSubmit,
        initialValues: { nome: '', idCidade: undefined , id_cidade: 0  }
    })

    const handlePage = (event: DataTablePageParams | any) => {
        setLoading(true)
        console.log(cS)
        service.find(filtro.nome, cS, event?.page, event?.rows)
                .then(result => {
                    setEstadios({...result, first: event?.first})
                }).finally(() => setLoading(false))
    }

    const deletar = (estadio: Estadio) => {
        service.deletar(estadio.id).then(result => {
            handlePage(null)
        })
    }

    const actionTemplate = (registro: Estadio) => {
        const url = `/cadastros/estadios?id=${registro.id}`
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

    const formik = useFormik<Estadio>({
        initialValues: {...formScheme},
        onSubmit(values, formikHelpers) {
            
        },
        enableReinitialize: true,
        validationSchema: validationScheme
    })

    const handleCidadeAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        cidadeService
            .find(nome, '', 0, 20)
            .then(cidades => setListaCidades(cidades))
    }

    const handleCidadeChange = (e: AutoCompleteChangeParams) => {
        const cidadeSelecionada: Cidade = e.value
        formik.setFieldValue("idCidade", cidadeSelecionada)
        cS = cidadeSelecionada.id
        console.log(cidadeSelecionada)
    }

    return (
        <Layout titulo="Estádios">
            <form onSubmit={formikSubmit}>
            <div className='p-fluid'>
                <div className='columns'>
                    <Input label="Nome" id="nome"
                        columnClasses='is-full'
                        autoComplete='off'
                        onChange={handleChange}
                        name="nome" value={filtro.nome} />
                </div>
                <div className='p-field'>
                    <label htmlFor="cidade">Cidade: *</label>
                    <AutoComplete
                        suggestions={listaCidades.content}
                        completeMethod={handleCidadeAutoComplete}
                        value={formik.values.idCidade}
                        field="nome"
                        id="idCidade"
                        name="idCidade"
                        onChange={handleCidadeChange}
                        />
                    <small className='p-error p-d-block'>
                        {formik.errors.idCidade}
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
                                onClick={e => Router.push("/cadastros/estadios")}
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
                    <DataTable value={estadios.content}
                            totalRecords={estadios.totalElements}
                            lazy paginator
                            first={estadios.first}
                            rows={estadios.size}
                            onPage={handlePage}
                            loading={loading}
                            emptyMessage="Nenhum registro."
                            >
                        <Column field='id' header="Código" />
                        <Column field='nome' header="Nome" />
                        <Column field='idCidade.nome' header="Cidade" />
                        <Column body={actionTemplate} />
                    </DataTable>

                </div>

            </div>
        </Layout>
    )
}