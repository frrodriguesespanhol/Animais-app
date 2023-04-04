import { Campeonato } from 'app/models/campeonatos'
import { Layout } from 'components'
import { Input } from 'components'
import { useFormik } from 'formik'
import { useState } from 'react'
import { DataTable, DataTablePageParams } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { Page } from 'app/models/common/page'
import { useCampeonatoService } from 'app/services'
import Router from 'next/router'

interface ConsultaCampeonatosForm {
    nome?: string
    ano?: string
}

export const ListagemCampeonatos: React.FC = () => {

    const service = useCampeonatoService()
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ campeonatos, setCampeonatos ] = useState<Page<Campeonato>>({
        content: [],
        first: 0,
        number: 0,
        size: 10,
        totalElements: 0
    })

    const handleSubmit = (filtro: ConsultaCampeonatosForm) => {
        handlePage(null)
    }

    const {
        handleSubmit: formikSubmit,
        values: filtro,
        handleChange
    } = useFormik<ConsultaCampeonatosForm>({
        onSubmit: handleSubmit,
        initialValues: { nome: '', ano: '' }
    })

    const handlePage = (event: DataTablePageParams | any) => {
        setLoading(true)
        service.find(filtro.nome, filtro.ano, event?.page, event?.rows)
                .then(result => {
                    setCampeonatos({...result, first: event?.first})
                }).finally(() => setLoading(false))
    }

    const deletar = (campeonato: Campeonato) => {
        service.deletar(campeonato.id).then(result => {
            handlePage(null)
        })
    }

    const actionTemplate = (registro: Campeonato) => {
        const url = `/cadastros/campeonatos?id=${registro.id}`
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

    return (
        <Layout titulo="Campeonatos">
            <form onSubmit={formikSubmit}>
                <div className='columns'>
                    <Input label="Nome" id="nome"
                        columnClasses='is-half'
                        autoComplete='off'
                        onChange={handleChange}
                        name="nome" value={filtro.nome} />
                    <Input label="Ano" id="ano"
                        columnClasses='is-half'
                        onChange={handleChange}
                        name="ano" value={filtro.ano} />
                </div>
                <div className='field is-grouped'>
                    <div className='control is-link'>
                        <button type='submit' className='button is-success'>
                            Consultar
                        </button>
                    </div>
                    <div className='control is-link'>
                        <button type='submit'
                                onClick={e => Router.push("/cadastros/campeonatos")}
                                className='button is-warning'>
                            Novo
                        </button>
                    </div>
                </div>

            </form>

            <br/>

            <div className='columns'>
                <div className='is-full'>
                    <DataTable value={campeonatos.content}
                            totalRecords={campeonatos.totalElements}
                            lazy paginator
                            first={campeonatos.first}
                            rows={campeonatos.size}
                            onPage={handlePage}
                            loading={loading}
                            emptyMessage="Nenhum registro."
                            >
                        <Column field='id' header="Código" />
                        <Column field='nome' header="Nome" />
                        <Column field='ano' header="Ano" />
                        <Column body={actionTemplate} />
                    </DataTable>

                </div>

            </div>
        </Layout>
    )
}