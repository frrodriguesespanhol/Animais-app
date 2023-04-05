import { Layout } from 'components'
import { useFormik } from 'formik'
import { useState } from 'react'
import { DataTable, DataTablePageParams } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Page } from 'app/models/common/page'
import Router from 'next/router'
import { usePalpiteService } from 'app/services/palpites.service'
import { Palpites } from 'app/models/palpites'
import { InputProps, TextField } from '@mui/material'
import { Input } from 'components'
import { useSession } from 'next-auth/client'
import { AutoComplete, AutoCompleteChangeParams, AutoCompleteCompleteMethodParams } from 'primereact/autocomplete'
import { useUsuarioService } from 'app/services'
import { Usuario } from 'app/models/usuarios'

let cs_usuario: string | undefined

interface ConsultaPalpitesForm {
    data?: ''
    usuario?: Usuario
    usuario_1?: number,
    onSubmit?:() => void
}

 const formScheme = {
     data: undefined,
     usuario: undefined
 }

export const ListagemPalpites: React.FC<ConsultaPalpitesForm>  = ({
         data,
         usuario,
         usuario_1,
         onSubmit
    }) => {

    const [ session ] = useSession()
    
    const palpiteService = usePalpiteService()
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ palpites, setPalpites ] = useState<Page<Palpites>>({
        content: [],
        first: 0,
        number: 0,
        size: 10,
        totalElements: 0
    })

    const usuarioService = useUsuarioService()
    const [ listaUsuarios, setListaUsuarios ] = useState<Page<Usuario>>({
        content: [],
        first: 0,
        number: 0,
        size: 0,
        totalElements: 0
    })

    
    const handleSubmit = (filtro: ConsultaPalpitesForm) => {
        handlePage(null)
    }

    const {
        handleSubmit: formikSubmit,
        values: filtro,
        handleChange
    } = useFormik<ConsultaPalpitesForm>({
        onSubmit: handleSubmit,
        initialValues: { data: '', usuario: undefined, usuario_1: 0}
    })

    const handlePage = (event: DataTablePageParams | any) => {
        setLoading(true)
        console.log(filtro.data + " - " + cs_usuario)
        palpiteService.find(filtro.data, cs_usuario, event?.page, event?.rows)
                .then(result => {
                    setPalpites({...result, first: event?.first})
                }).finally(() => setLoading(false))
    }

    const formik = useFormik<ConsultaPalpitesForm>({
        initialValues: {...formScheme},
        onSubmit(values, formikHelpers) {
            
        },
        enableReinitialize: true,
        //validationSchema: validationScheme
    })

    const handleUsuariosAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        usuarioService
            .find(nome, '', 0, 20)
            .then(usuarios => setListaUsuarios(usuarios))
    }

    const handleUsuarioChange = (e: AutoCompleteChangeParams) => {
        const usuarioSelecionado: Usuario = e.value
        formik.setFieldValue("usuario", usuarioSelecionado)
        cs_usuario = usuarioSelecionado.id
        console.log(usuarioSelecionado)
    }

    
    const actionTemplate = (registro: Palpites) => {
        const url = `/cadastros/palpites?id=${registro.id}`
        const logado = session?.user?.email===registro.usuario?.email
        return (
            <div>
                <Button label="Palpitar"  
                        disabled={!logado}
                        className="p-button-rounded p-button-info"
                        onClick={e => Router.push(url)}
                        />
                {/* <Button label="Deletar" onClick={event => {
                    confirmDialog({
                        message: "Confirma a exclusão deste registro?",
                        acceptLabel: "Sim",
                        rejectLabel: "Não",
                        accept: () => deletar(registro),
                        header: "Confirmação"
                    })
                }} */}
                        {/* className="p-button-rounded p-button-danger"/> */}
            </div>
        )
    }



    return (
        <Layout titulo="Palpites">
            <form onSubmit={formikSubmit}>
            <div className='p-fluid'>
                <div className='columns'>
                    <Input label="Data" id="data"
                        columnClasses='is-half'
                        autoComplete='off'
                        type="date"
                        onChange={handleChange}
                        name="data" value={filtro.data} />

                </div>

                <div className='p-field'>
                    <label htmlFor="usuario">Usuário: *</label>
                    <AutoComplete
                        suggestions={listaUsuarios.content}
                        completeMethod={handleUsuariosAutoComplete}
                        value={formik.values.usuario}
                        field="nome"
                        id="usuario"
                        name="usuario"
                        onChange={handleUsuarioChange}
                        />
                    <small className='p-error p-d-block'>
                        {formik.errors.usuario}
                    </small>
                </div>
            </div>

                <div className='field is-grouped'>
                    <div className='control is-link'>
                        <button type='submit' className='button is-success'>
                            Consultar
                        </button>
                    </div>
                    {/* <div className='control is-link'>
                        <button type='submit'
                                onClick={e => Router.push("/cadastros/palpites")}
                                className='button is-warning'>
                            Novo
                        </button>
                    </div> */}
                </div>
            

            </form>

            <br/>

            <div className='columns'>
                <div className='is-full'>
                    <DataTable autoLayout
                            resizableColumns
                            columnResizeMode='fit'
                            value={palpites.content}
                            totalRecords={palpites.totalElements}
                            lazy paginator
                            first={palpites.first}
                            rows={palpites.size}
                            onPage={handlePage}
                            loading={loading}
                            emptyMessage="Nenhum registro."
                            >
                        <Column field='jogo.data_hora' header="Hora Jogo" />
                        <Column field='data_hora' header="Hora Palpite" />
                        <Column field='jogo.equ1.nome' header="Equipe 1" />
                        <Column field='gols_equ1' header="G1" />
                        <Column field='gols_equ2' header="G2" />
                        <Column field='jogo.equ2.nome' header="Equipe 2" />
                        <Column field='jogo.fase.nome' header="Fase" />
                        <Column field='usuario.nome' header="Apostador" />
                        <Column body={actionTemplate} />
                    </DataTable>

                </div>

            </div>
        </Layout>
    )
}