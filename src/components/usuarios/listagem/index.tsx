import { Empresas } from 'app/models/empresas'
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
import Router from 'next/router'
import { Usuario } from 'app/models/usuarios'
import { AutoComplete, AutoCompleteChangeParams, AutoCompleteCompleteMethodParams } from 'primereact/autocomplete'
import { useEmpresaService } from 'app/services/empresas.service'
import { useUsuarioService } from 'app/services/usuario.service'

let cS: string | undefined

interface ConsultaUsuariosForm {
    nome?: string
    email?: string
    senha?: string
    idEmpresa?: Empresas
    id_empresa?: number
    tipo?: string
    onSubmit?: (usuario: Usuario) => void
}

const formScheme: Usuario = {
    nome: '',
    email: '',
    senha: '',
    idEmpresa: undefined,
    tipo: ''
}

export const ListagemUsuarios: React.FC<ConsultaUsuariosForm> = ({
        nome,
        idEmpresa,
        id_empresa,
        onSubmit
    }) => {

    const empresaService = useEmpresaService()
    const [ listaEmpresas, setListaEmpresas ] = useState<Page<Empresas>>({
        content: [],
        first: 0,
        number: 0,
        size: 0,
        totalElements: 0
    })

    const service = useUsuarioService()
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ usuarios, setUsuarios ] = useState<Page<Usuario>>({
        content: [],
        first: 0,
        number: 0,
        size: 10,
        totalElements: 0
    })

    const handleSubmit = (filtro: ConsultaUsuariosForm) => {
        handlePage(null)
    }

    const {
        handleSubmit: formikSubmit,
        values: filtro,
        handleChange
    } = useFormik<ConsultaUsuariosForm>({
        onSubmit: handleSubmit,
        initialValues: { nome: '', email: '', senha: '', idEmpresa: undefined , id_empresa: 0, tipo: ''  }
    })

    const handlePage = (event: DataTablePageParams | any) => {
        setLoading(true)
        console.log(cS)
        service.find(filtro.nome, cS, event?.page, event?.rows)
                .then(result => {
                    setUsuarios({...result, first: event?.first})
                }).finally(() => setLoading(false))
    }

    const deletar = (usuario: Usuario) => {
        service.deletar(usuario.id).then(result => {
            handlePage(null)
        })
    }

    const actionTemplate = (registro: Usuario) => {
        const url = `/cadastros/usuarios?id=${registro.id}`
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

    const formik = useFormik<Usuario>({
        initialValues: {...formScheme},
        onSubmit(values, formikHelpers) {
            
        },
        enableReinitialize: true,
        validationSchema: validationScheme
    })

    const handleEmpresaAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        empresaService
            .find(nome, 0, 20)
            .then(empresas => setListaEmpresas(empresas))
    }

    const handleEmpresaChange = (e: AutoCompleteChangeParams) => {
        const empresaSelecionada: Empresas = e.value
        formik.setFieldValue("idEmpresa", empresaSelecionada)
        cS = empresaSelecionada.id
        console.log(empresaSelecionada)
    }

    return (
        <Layout titulo="Usuários">
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
                    <label htmlFor="empresa">Empresa: *</label>
                    <AutoComplete
                        suggestions={listaEmpresas.content}
                        completeMethod={handleEmpresaAutoComplete}
                        value={formik.values.idEmpresa}
                        field="empresa"
                        id="idEmpresa"
                        name="idEmpresa"
                        onChange={handleEmpresaChange}
                        />
                    <small className='p-error p-d-block'>
                        {formik.errors.idEmpresa}
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
                                onClick={e => Router.push("/cadastros/usuarios")}
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
                    <DataTable value={usuarios.content}
                            totalRecords={usuarios.totalElements}
                            lazy paginator
                            first={usuarios.first}
                            rows={usuarios.size}
                            onPage={handlePage}
                            loading={loading}
                            emptyMessage="Nenhum registro."
                            >
                        <Column field='id' header="Código" />
                        <Column field='nome' header="Nome" />
                        <Column field='email' header="E-mail" />
                        <Column field='idEmpresa.nome' header="Empresa" />
                        <Column body={actionTemplate} />
                    </DataTable>

                </div>

            </div>
        </Layout>
    )
}