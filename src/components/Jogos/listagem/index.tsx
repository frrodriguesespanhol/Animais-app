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
import { useEquipeService } from 'app/services'
import Router from 'next/router'
import { Equipes } from 'app/models/equipes'
import { AutoComplete, AutoCompleteChangeParams, AutoCompleteCompleteMethodParams } from 'primereact/autocomplete'
import { Jogos } from 'app/models/jogos'
import { useJogoService } from 'app/services/jogos.service'
import { Fases } from 'app/models/fases'
import { useFaseService } from 'app/services/fases.service'

let cS: string | undefined
let cs_fase: string | undefined

interface ConsultaJogosForm {
    equ1?: Equipes,
    equ1_1?: number,
    fase?: Fases,
    fase_1?: number,
    onSubmit?: (jogo: Jogos) => void
}

const formScheme: Jogos = {
    equ1: undefined,
    fase: undefined
}

export const ListagemJogos: React.FC<ConsultaJogosForm> = ({
        equ1,
        equ1_1,
        fase,
        fase_1,
        onSubmit
    }) => {

    const equipesService = useEquipeService()
    const [ listaEquipes, setListaEquipes ] = useState<Page<Equipes>>({
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
    } = useFormik<ConsultaJogosForm>({
        onSubmit: handleSubmit,
        initialValues: { equ1: undefined, equ1_1: 0, fase: undefined, fase_1: 0 }
    })

    const handlePage = (event: DataTablePageParams | any) => {
        setLoading(true)
        console.log(cS + " - " + cs_fase)
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
        onSubmit(values, formikHelpers) {
            
        },
        enableReinitialize: true,
        //validationSchema: validationScheme
    })

    const handleEquipesAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        equipesService
            .find(nome, 0, 20)
            .then(equipes => setListaEquipes(equipes))
    }

    const handleEquipeChange = (e: AutoCompleteChangeParams) => {
        const equipeSelecionada: Equipes = e.value
        formik.setFieldValue("equ1", equipeSelecionada)
        cS = equipeSelecionada.id
        console.log(equipeSelecionada)
    }

    const handleFasesAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        faseService
            .find(nome, 0, 20)
            .then(fases => setListaFases(fases))
    }

    const handleFaseChange = (e: AutoCompleteChangeParams) => {
        const faseSelecionada: Fases = e.value
        formik.setFieldValue("fase", faseSelecionada)
        cs_fase = faseSelecionada.id
        console.log(faseSelecionada)
    }


    return (
        <Layout titulo="Jogos">
            <form onSubmit={formikSubmit}>
            
            <div className='p-fluid'>
                
                <div className='p-field'>
                    <label htmlFor="fase">Fase: *</label>
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
                    <label htmlFor="campeonato">Equipe: *</label>
                    <AutoComplete
                        suggestions={listaEquipes.content}
                        completeMethod={handleEquipesAutoComplete}
                        value={formik.values.equ1}
                        field="nome"
                        id="equ1"
                        name="equ1"
                        onChange={handleEquipeChange}
                        />
                    <small className='p-error p-d-block'>
                        {formik.errors.equ1}
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
                    <DataTable autoLayout
                            resizableColumns
                            columnResizeMode='fit'
                            value={jogos.content}
                            totalRecords={jogos.totalElements}
                            lazy paginator
                            first={jogos.first}
                            rows={jogos.size}
                            onPage={handlePage}
                            loading={loading}
                            emptyMessage="Nenhum registro."
                            >
                        <Column field='data_hora' header="Data e Hora" />
                        <Column field='equ1.nome' header="Equipe 1" />
                        <Column field='gols1' header="G1" />
                        <Column field='gols2' header="G2" />
                        <Column field='equ2.nome' header="Equipe 2" />
                        <Column field='estadio.nome' header="Estádio" />
                        <Column field='fase.nome' header="Fase" />
                        <Column field='campeonato.nome' header="Campeonato" />
                        <Column body={actionTemplate} />
                    </DataTable>

                </div>

            </div>
        </Layout>
    )
}