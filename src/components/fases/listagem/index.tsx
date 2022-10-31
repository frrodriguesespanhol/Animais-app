import { Layout } from 'components'
import { Input } from 'components'
import { useFormik } from 'formik'
import { useState } from 'react'
import { DataTable, DataTablePageParams } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { Page } from 'app/models/common/page'
import { useFaseService } from 'app/services/fases.service'
import Router from 'next/router'
import { Fases } from 'app/models/fases'

interface ConsultaFaseForm {
    nome?: string
}

export const ListagemFases: React.FC = () => {

    const service = useFaseService()
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ fases, setFases ] = useState<Page<Fases>>({
        content: [],
        first: 0,
        number: 0,
        size: 10,
        totalElements: 0
    })

    const handleSubmit = (filtro: ConsultaFaseForm) => {
        handlePage(null)
    }

    const {
        handleSubmit: formikSubmit,
        values: filtro,
        handleChange
    } = useFormik<ConsultaFaseForm>({
        onSubmit: handleSubmit,
        initialValues: { nome: ''}
    })

    const handlePage = (event: DataTablePageParams | any) => {
        setLoading(true)
        service.find(filtro.nome, event?.page, event?.rows)
                .then(result => {
                    setFases({...result, first: event?.first})
                }).finally(() => setLoading(false))
    }

    const deletar = (fase: Fases) => {
        service.deletar(fase.id).then(result => {
            handlePage(null)
        })
    }

    const actionTemplate = (registro: Fases) => {
        const url = `/cadastros/fases?id=${registro.id}`
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
        <Layout titulo="Fases">
            <form onSubmit={formikSubmit}>
                <div className='columns'>
                    <Input label="Nome" id="nome"
                        columnClasses='is-half'
                        autoComplete='off'
                        onChange={handleChange}
                        name="nome" value={filtro.nome} />
                </div>
                <div className='field is-grouped'>
                    <div className='control is-link'>
                        <button type='submit' className='button is-success'>
                            Consultar
                        </button>
                    </div>
                    <div className='control is-link'>
                        <button type='submit'
                                onClick={e => Router.push("/cadastros/fases")}
                                className='button is-warning'>
                            Novo
                        </button>
                    </div>
                </div>

            </form>

            <br/>

            <div className='columns'>
                <div className='is-full'>
                    <DataTable value={fases.content}
                            totalRecords={fases.totalElements}
                            lazy paginator
                            first={fases.first}
                            rows={fases.size}
                            onPage={handlePage}
                            loading={loading}
                            emptyMessage="Nenhum registro."
                            >
                        <Column field='id' header="Código" />
                        <Column field='nome' header="Nome da Fase" />
                        <Column body={actionTemplate} />
                    </DataTable>

                </div>

            </div>
        </Layout>
    )
}