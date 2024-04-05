import { Animais } from 'app/models/animais'
import { Layout } from 'components'
import { Input } from 'components'
import { useFormik } from 'formik'
import { useState } from 'react'
import { DataTable, DataTablePageParams } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { Page } from 'app/models/common/page'
import { useAnimaisService, useClassificacaoService, useEspecieService, useGrupoService } from 'app/services'
import Router from 'next/router'
import { AutoComplete, AutoCompleteChangeParams, AutoCompleteCompleteMethodParams } from 'primereact/autocomplete'
import { Grupos } from 'app/models/grupos'
import { Classificacao } from 'app/models/classificacao'
import { Especie } from 'app/models/especies'
import { validationScheme } from './validationSchema'

let cS_grupo: string | undefined
let cS_classificacao: string | undefined
let cS_especie: string | undefined

interface ConsultaAnimaisForm {
    idGrupoAnimal?: undefined
    id_grupo?: number
    idClassificacaoAnimal?: undefined
    id_classificacao?: number
    idEspecieAnimal?: undefined
    id_especie?: number
    onSubmit?: (animais: Animais) => void
}

const formScheme: Animais = {
    idGrupoAnimal: undefined,
    idClassificacaoAnimal: undefined,
    idEspecieAnimal: undefined
}

export const ListagemAnimais: React.FC<ConsultaAnimaisForm> = ({
    idGrupoAnimal,
    id_grupo,
    idClassificacaoAnimal,
    id_classificacao,
    idEspecieAnimal,
    id_especie,
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

    const classificacaoService = useClassificacaoService()
    const [ listaClassificacoes, setListaClassificacoes ] = useState<Page<Classificacao>>({
        content: [],
        first: 0,
        number: 0,
        size: 0,
        totalElements: 0
    })

    const especieService = useEspecieService()
    const [ listaEspecies, setListaEspecies ] = useState<Page<Especie>>({
        content: [],
        first: 0,
        number: 0,
        size: 0,
        totalElements: 0
    })

    const service = useAnimaisService()
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ animal, setAnimal ] = useState<Page<Animais>>({
        content: [],
        first: 0,
        number: 0,
        size: 10,
        totalElements: 0
    })

    const handleSubmit = (filtro: ConsultaAnimaisForm) => {
        handlePage(null)
    }

    const {
        handleSubmit: formikSubmit,
        values: filtro,
        handleChange
    } = useFormik<ConsultaAnimaisForm>({
        onSubmit: handleSubmit,
        initialValues: { idGrupoAnimal: undefined, id_grupo:0, idClassificacaoAnimal: undefined, id_classificacao:0, idEspecieAnimal: undefined, id_especie:0 }
    })

    const handlePage = (event: DataTablePageParams | any) => {
        setLoading(true)
        console.log(cS_grupo + ', ' + cS_classificacao + ', ' + cS_especie)
        //service.find(filtro.idGrupoAnimal, filtro.idClassificacaoAnimal, filtro.idEspecieAnimal, event?.page, event?.rows)
        service.find(cS_grupo, cS_classificacao, cS_especie, event?.page, event?.rows)
                .then(result => {
                    setAnimal({...result, first: event?.first})
                }).finally(() => setLoading(false))
    }

    const deletar = (animais: Animais) => {
        service.deletar(animais.id).then(result => {
            handlePage(null)
        })
    }

    const actionTemplate = (registro: Animais) => {
        const url = `/cadastros/animais?id=${registro.id}`
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

    const formik = useFormik<Animais>({
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
        formik.setFieldValue("idGrupoAnimal", grupoSelecionado)
        cS_grupo = grupoSelecionado.id
        console.log(grupoSelecionado)
    }

    const handleClassificacaoAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        classificacaoService
            .find_combo(nome, cS_grupo, 0, 20)
            .then(classificacoes => setListaClassificacoes(classificacoes))
    }

    const handleClassificacaoChange = (e: AutoCompleteChangeParams) => {
        const classificacaoSelecionada: Classificacao = e.value
        formik.setFieldValue("idClassificacaoAnimal", classificacaoSelecionada)
        cS_classificacao = classificacaoSelecionada.id
        console.log(classificacaoSelecionada)
    }

    const handleEspecieAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        especieService
            .find_combo(nome, cS_classificacao, 0, 20)
            .then(especies => setListaEspecies(especies))
    }

    const handleEspecieChange = (e: AutoCompleteChangeParams) => {
        const especieSelecionada: Especie = e.value
        formik.setFieldValue("idEspecieAnimal", especieSelecionada)
        cS_especie = especieSelecionada.id
        console.log(especieSelecionada)
    }

    return (
        <Layout titulo="Animais">
            <form onSubmit={formikSubmit}>
                <div className='p-fluid'>
                    <div className='p-field'>
                        <label htmlFor="grupo">Grupo: *</label>
                        <AutoComplete
                            suggestions={listaGrupos.content}
                            completeMethod={handleGrupoAutoComplete}
                            value={formik.values.idGrupoAnimal}
                            field="nome"
                            id="idGrupoAnimal"
                            name="idGrupoAnimal"
                            onChange={handleGrupoChange}
                            />
                        <small className='p-error p-d-block'>
                            {formik.errors.id}
                        </small>                
                    </div>

                    <div className='p-field'>
                        <label htmlFor="classificacao">Classificação: *</label>
                        <AutoComplete
                            suggestions={listaClassificacoes.content}
                            completeMethod={handleClassificacaoAutoComplete}
                            value={formik.values.idClassificacaoAnimal}
                            field="nome"
                            id="idClassificacaoAnimal"
                            name="idClassificacaoAnimal"
                            onChange={handleClassificacaoChange}
                            />
                        <small className='p-error p-d-block'>
                            {formik.errors.id}
                        </small>
                    </div>

                    <div className='p-field'>
                        <label htmlFor="especie">Espécie: *</label>
                        <AutoComplete
                            suggestions={listaEspecies.content}
                            completeMethod={handleEspecieAutoComplete}
                            value={formik.values.idEspecieAnimal}
                            field="nome"
                            id="idEspecieAnimal"
                            name="idEspecieAnimal"
                            onChange={handleEspecieChange}
                            />
                        <small className='p-error p-d-block'>
                            {formik.errors.id}
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
                                    onClick={e => Router.push("/cadastros/animais")}
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
                    <DataTable value={animal.content}
                            totalRecords={animal.totalElements}
                            lazy paginator
                            first={animal.first}
                            rows={animal.size}
                            onPage={handlePage}
                            loading={loading}
                            emptyMessage="Nenhum registro."
                            >
                        <Column field='id' header="Código" />
                        <Column field='data' header="Dt. Cadastro" />
                        <Column field='idEspecieAnimal.nome' header="Espécie" />
                        <Column field='cadastradopor' header="Cadastrado por" />
                        <Column field='estado' header="Estado" />
                        <Column body={actionTemplate} />
                    </DataTable>

                </div>

            </div>
        </Layout>
    )
}