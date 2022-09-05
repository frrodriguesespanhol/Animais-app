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
import { useSelecaoService } from 'app/services'
import Router from 'next/router'
import { Selecoes } from 'app/models/selecoes'
import { AutoComplete, AutoCompleteChangeParams, AutoCompleteCompleteMethodParams } from 'primereact/autocomplete'
import { Jogos } from 'app/models/jogos'
import { useJogoService } from 'app/services/jogos.service'
import { Fases } from 'app/models/fases'
import { useFaseService } from 'app/services/fases.service'

let cS: string
let cs_fase: string

interface ConsultaJogosForm {
    sel1?: Selecoes,
    sel1_1?: number,
    fase?: Fases,
    fase_1?: number,
    onSubmit?: (jogo: Jogos) => void
}

const formScheme: Jogos = {
    sel1: undefined,
    fase: undefined
}

export const ListagemJogos: React.FC<ConsultaJogosForm> = ({
        sel1,
        sel1_1,
        fase,
        fase_1,
        onSubmit
    }) => {

    const selecoesService = useSelecaoService()
    const [ listaSelecoes, setListaSelecoes ] = useState<Page<Selecoes>>({
        content: [],
        first: 0,
        number: 0,
        size: 0,
        totalElements: 0
    })

    const faseService = useFaseService()
    const [ listaFases, setListaFases ] = useState<Page<Fases>>({
        content: [],
        first: 0,
        number: 0,
        size: 0,
        totalElements: 0
    })

    const jogosService = useJogoService()
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ jogos, setJogos ] = useState<Page<Jogos>>({
        content: [],
        first: 0,
        number: 0,
        size: 10,
        totalElements: 0
    })

    const handleSubmit = (filtro: ConsultaJogosForm) => {
        handlePage(null)
    }

    const {
        handleSubmit: formikSubmit,
        values: filtro,
        handleChange
    } = useFormik<ConsultaJogosForm>({
        onSubmit: handleSubmit,
        initialValues: { sel1: undefined, sel1_1: 0, fase: undefined, fase_1: 0 }
    })

    const handlePage = (event: DataTablePageParams) => {
        setLoading(true)
        console.log(cS)
        jogosService.find(cS, cs_fase, event?.page, event?.rows)
                .then(result => {
                    setJogos({...result, first: event?.first})
                }).finally(() => setLoading(false))
    }

    const deletar = (jogo: Jogos) => {
        jogosService.deletar(jogo.id).then(result => {
            handlePage(null)
        })
    }

    const actionTemplate = (registro: Jogos) => {
        const url = `/cadastros/jogos?id=${registro.id}`
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

    const formik = useFormik<Jogos>({
        initialValues: {...formScheme},
        onSubmit,
        enableReinitialize: true,
        validationSchema: validationScheme
    })

    const handleSelecoesAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        selecoesService
            .find(nome, 0, 20)
            .then(selecoes => setListaSelecoes(selecoes))
    }

    const handleSelecaoChange = (e: AutoCompleteChangeParams) => {
        const selecaoSelecionada: Jogos = e.value
        formik.setFieldValue("sel1", selecaoSelecionada)
        cS = selecaoSelecionada.sel1
        console.log(selecaoSelecionada)
    }

    const handleFasesAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        faseService
            .find(nome, 0, 20)
            .then(fases => setListaFases(fases))
    }

    const handleFaseChange = (e: AutoCompleteChangeParams) => {
        const faseSelecionada: Jogos = e.value
        formik.setFieldValue("fase", faseSelecionada)
        cs_fase = faseSelecionada.fase
        console.log(faseSelecionada)
    }


    return (
        <Layout titulo="Jogos">
            <form onSubmit={formikSubmit}>
            
            <div className='p-fluid'>
                
                <div className='p-field'>
                    <label htmlFor="copa">Fase: *</label>
                    <AutoComplete
                        suggestions={listaFases.content}
                        completeMethod={handleFasesAutoComplete}
                        value={formik.values.fase}
                        field="nome"
                        id="fase"
                        name="fase"
                        onChange={handleFaseChange}
                        />
                    <small className='p-error p-d-block'>
                        {formik.errors.fase}
                    </small>
                </div>

                <div className='p-field'>
                    <label htmlFor="copa">Seleção: *</label>
                    <AutoComplete
                        suggestions={listaSelecoes.content}
                        completeMethod={handleSelecoesAutoComplete}
                        value={formik.values.sel1}
                        field="nome"
                        id="idSelecao"
                        name="idSelecao"
                        onChange={handleSelecaoChange}
                        />
                    <small className='p-error p-d-block'>
                        {formik.errors.sel1}
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
                                onClick={e => Router.push("/cadastros/jogos")}
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
                    <DataTable value={jogos.content}
                            totalRecords={jogos.totalElements}
                            lazy paginator
                            first={jogos.first}
                            rows={jogos.size}
                            onPage={handlePage}
                            loading={loading}
                            emptyMessage="Nenhum registro."
                            >
                        <Column field='id' header="Código" />
                        <Column field='fase.nome' header="Fase" />
                        <Column field='idSelecao.nome' header="Seleção" />
                        <Column body={actionTemplate} />
                    </DataTable>

                </div>

            </div>
        </Layout>
    )
}