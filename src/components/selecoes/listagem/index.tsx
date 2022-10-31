import { Layout } from 'components'
import { Input } from 'components'
import { useFormik } from 'formik'
import { useState } from 'react'
import { DataTable, DataTablePageParams } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { Page } from 'app/models/common/page'
import { useCopaService, useSelecaoService } from 'app/services'
import Router from 'next/router'
import { Selecoes } from 'app/models/selecoes'

interface ConsultaSelecoesForm {
    nome?: string
}

export const ListagemSelecoes: React.FC = () => {

    const service = useSelecaoService()
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ selecoes, setSelecoes ] = useState<Page<Selecoes>>({
        content: [],
        first: 0,
        number: 0,
        size: 10,
        totalElements: 0
    })

    const handleSubmit = (filtro: ConsultaSelecoesForm) => {
        handlePage(null)
    }

    const {
        handleSubmit: formikSubmit,
        values: filtro,
        handleChange
    } = useFormik<ConsultaSelecoesForm>({
        onSubmit: handleSubmit,
        initialValues: { nome: ''}
    })

    const handlePage = (event: DataTablePageParams | any) => {
        setLoading(true)
        service.find(filtro.nome, event?.page, event?.rows)
                .then(result => {
                    setSelecoes({...result, first: event?.first})
                }).finally(() => setLoading(false))
    }

    const deletar = (selecao: Selecoes) => {
        service.deletar(selecao.id).then(result => {
            handlePage(null)
        })
    }

    const actionTemplate = (registro: Selecoes) => {
        const url = `/cadastros/selecoes?id=${registro.id}`
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
        <Layout titulo="Seleções">
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
                                onClick={e => Router.push("/cadastros/selecoes")}
                                className='button is-warning'>
                            Novo
                        </button>
                    </div>
                </div>

            </form>

            <br/>

            <div className='columns'>
                <div className='is-full'>
                    <DataTable value={selecoes.content}
                            totalRecords={selecoes.totalElements}
                            lazy paginator
                            first={selecoes.first}
                            rows={selecoes.size}
                            onPage={handlePage}
                            loading={loading}
                            emptyMessage="Nenhum registro."
                            >
                        <Column field='id' header="Código" />
                        <Column field='nome' header="Nome" />
                        <Column body={actionTemplate} />
                    </DataTable>

                </div>

            </div>
        </Layout>
    )
}