import { Copa } from 'app/models/copas'
import { Layout } from 'components'
import { Input } from 'components'
import { useFormik } from 'formik'
import { useState } from 'react'
import { DataTable, DataTablePageParams } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { Page } from 'app/models/common/page'
import { useCopaService } from 'app/services'
import Router from 'next/router'

interface ConsultaCopasForm {
    nome?: string
    ano?: string
}

export const ListagemCopas: React.FC = () => {

    const service = useCopaService()
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ copas, setCopas ] = useState<Page<Copa>>({
        content: [],
        first: 0,
        number: 0,
        size: 10,
        totalElements: 0
    })

    const handleSubmit = (filtro: ConsultaCopasForm) => {
        handlePage(null)
    }

    const {
        handleSubmit: formikSubmit,
        values: filtro,
        handleChange
    } = useFormik<ConsultaCopasForm>({
        onSubmit: handleSubmit,
        initialValues: { nome: '', ano: '' }
    })

    const handlePage = (event: DataTablePageParams | any) => {
        setLoading(true)
        service.find(filtro.nome, filtro.ano, event?.page, event?.rows)
                .then(result => {
                    setCopas({...result, first: event?.first})
                }).finally(() => setLoading(false))
    }

    const deletar = (copa: Copa) => {
        service.deletar(copa.id).then(result => {
            handlePage(null)
        })
    }

    const actionTemplate = (registro: Copa) => {
        const url = `/cadastros/copas?id=${registro.id}`
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
        <Layout titulo="Copas">
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
                                onClick={e => Router.push("/cadastros/copas")}
                                className='button is-warning'>
                            Novo
                        </button>
                    </div>
                </div>

            </form>

            <br/>

            <div className='columns'>
                <div className='is-full'>
                    <DataTable value={copas.content}
                            totalRecords={copas.totalElements}
                            lazy paginator
                            first={copas.first}
                            rows={copas.size}
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