import { Layout } from 'components'
import { Input } from 'components'
import { useFormik } from 'formik'
import { useState } from 'react'
import { DataTable, DataTablePageParams } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { Page } from 'app/models/common/page'
import { useEmpresaService } from 'app/services/empresas.service'
import Router from 'next/router'
import { Empresas } from 'app/models/empresas'

interface ConsultaEmpresaForm {
    nome?: string
    cidade?: string
}

export const ListagemEmpresas: React.FC = () => {

    const service = useEmpresaService()
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ empresas, setEmpresas ] = useState<Page<Empresas>>({
        content: [],
        first: 0,
        number: 0,
        size: 10,
        totalElements: 0
    })

    const handleSubmit = (filtro: ConsultaEmpresaForm) => {
        handlePage(null)
    }

    const {
        handleSubmit: formikSubmit,
        values: filtro,
        handleChange
    } = useFormik<ConsultaEmpresaForm>({
        onSubmit: handleSubmit,
        initialValues: { nome: '', cidade: ''}
    })

    const handlePage = (event: DataTablePageParams | any) => {
        setLoading(true)
        service.find(filtro.nome, event?.page, event?.rows)
                .then(result => {
                    setEmpresas({...result, first: event?.first})
                }).finally(() => setLoading(false))
    }

    const deletar = (empresa: Empresas) => {
        service.deletar(empresa.id).then(result => {
            handlePage(null)
        })
    }

    const actionTemplate = (registro: Empresas) => {
        const url = `/cadastros/empresas?id=${registro.id}`
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
        <Layout titulo="Empresas">
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
                                onClick={e => Router.push("/cadastros/empresas")}
                                className='button is-warning'>
                            Novo
                        </button>
                    </div>
                </div>

            </form>

            <br/>

            <div className='columns'>
                <div className='is-full'>
                    <DataTable value={empresas.content}
                            totalRecords={empresas.totalElements}
                            lazy paginator
                            first={empresas.first}
                            rows={empresas.size}
                            onPage={handlePage}
                            loading={loading}
                            emptyMessage="Nenhum registro."
                            >
                        <Column field='id' header="Código" />
                        <Column field='nome' header="Nome da Empresa" />
                        <Column field='cidade' header="Cidade" />
                        <Column body={actionTemplate} />
                    </DataTable>

                </div>

            </div>
        </Layout>
    )
}