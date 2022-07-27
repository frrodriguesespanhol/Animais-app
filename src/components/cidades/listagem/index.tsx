import { Cidade } from 'app/models/cidades'
import { Layout } from 'components'
import { Input } from 'components'
import { useFormik } from 'formik'
import { useState } from 'react'
import { DataTable, DataTablePageParams } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { Page } from 'app/models/common/page'
import { useCidadeService } from 'app/services'
import Router from 'next/router'

interface ConsultaCidadesForm {
    nome?: string
    idcopa?: string
}

export const ListagemCidades: React.FC = () => {

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
        initialValues: { nome: '', idcopa: '' }
    })

    const handlePage = (event: DataTablePageParams) => {
        setLoading(true)
        service.find(filtro.nome, filtro.idcopa, event?.page, event?.rows)
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

    return (
        <Layout titulo="Cidades">
            <form onSubmit={formikSubmit}>
                <div className='columns'>
                    <Input label="Nome" id="nome"
                        columnClasses='is-half'
                        autoComplete='off'
                        onChange={handleChange}
                        name="nome" value={filtro.nome} />
                    <Input label="Copa" id="idcopa"
                        columnClasses='is-half'
                        onChange={handleChange}
                        name="idcopa" value={filtro.idcopa} />
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
                        <Column field='idcopa' header="Copa" />
                        <Column body={actionTemplate} />
                    </DataTable>

                </div>

            </div>
        </Layout>
    )
}