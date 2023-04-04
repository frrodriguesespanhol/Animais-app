import { Campeonato } from 'app/models/campeonatos'
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
import { useCidadeService, useCampeonatoService } from 'app/services'
import Router from 'next/router'
import { Cidade } from 'app/models/cidades'
import { AutoComplete, AutoCompleteChangeParams, AutoCompleteCompleteMethodParams } from 'primereact/autocomplete'

let cS: string | undefined

interface ConsultaCidadesForm {
    nome?: string
    idCampeonato?: Campeonato
    id_campeonato?: number
    onSubmit?: (cidade: Cidade) => void
}

const formScheme: Cidade = {
    idCampeonato: undefined,
    nome: ''
}

export const ListagemCidades: React.FC<ConsultaCidadesForm> = ({
        nome,
        idCampeonato,
        id_campeonato,
        onSubmit
    }) => {

    const campeonatoService = useCampeonatoService()
    const [ listaCampeonatos, setListaCampeonatos ] = useState<Page<Campeonato>>({
        content: [],
        first: 0,
        number: 0,
        size: 0,
        totalElements: 0
    })

    const service = useCidadeService()
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ cidades, setCidades ] = useState<Page<Cidade>>({
        content: [],
        first: 0,
        number: 0,
        size: 10,
        totalElements: 0
    })

    const handleSubmit = (filtro: ConsultaCidadesForm) => {
        handlePage(null)
    }

    const {
        handleSubmit: formikSubmit,
        values: filtro,
        handleChange
    } = useFormik<ConsultaCidadesForm>({
        onSubmit: handleSubmit,
        initialValues: { nome: '', idCampeonato: undefined , id_campeonato: 0  }
    })

    const handlePage = (event: DataTablePageParams | any) => {
        setLoading(true)
        console.log(cS)
        service.find(filtro.nome, cS, event?.page, event?.rows)
                .then(result => {
                    setCidades({...result, first: event?.first})
                }).finally(() => setLoading(false))
    }

    const deletar = (cidade: Cidade) => {
        service.deletar(cidade.id).then(result => {
            handlePage(null)
        })
    }

    const actionTemplate = (registro: Cidade) => {
        const url = `/cadastros/cidades?id=${registro.id}`
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

    const formik = useFormik<Cidade>({
        initialValues: {...formScheme},
        onSubmit(values, formikHelpers) {
            
        },
        enableReinitialize: true,
        validationSchema: validationScheme
    })

    const handleCampeonatoAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        campeonatoService
            .find(nome, '', 0, 20)
            .then(campeonatos => setListaCampeonatos(campeonatos))
    }

    const handleCampeonatoChange = (e: AutoCompleteChangeParams) => {
        const campeonatoSelecionado: Campeonato = e.value
        formik.setFieldValue("idCampeonato", campeonatoSelecionado)
        cS = campeonatoSelecionado.id
        console.log(campeonatoSelecionado)
    }

    return (
        <Layout titulo="Cidades">
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
                    <label htmlFor="campeonato">Campeonato: *</label>
                    <AutoComplete
                        suggestions={listaCampeonatos.content}
                        completeMethod={handleCampeonatoAutoComplete}
                        value={formik.values.idCampeonato}
                        field="nome"
                        id="idCampeonato"
                        name="idCampeonato"
                        onChange={handleCampeonatoChange}
                        />
                    <small className='p-error p-d-block'>
                        {formik.errors.idCampeonato}
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
                                onClick={e => Router.push("/cadastros/cidades")}
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
                    <DataTable value={cidades.content}
                            totalRecords={cidades.totalElements}
                            lazy paginator
                            first={cidades.first}
                            rows={cidades.size}
                            onPage={handlePage}
                            loading={loading}
                            emptyMessage="Nenhum registro."
                            >
                        <Column field='id' header="Código" />
                        <Column field='nome' header="Nome" />
                        <Column field='idCampeonato.nome' header="Campeonato" />
                        <Column body={actionTemplate} />
                    </DataTable>

                </div>

            </div>
        </Layout>
    )
}