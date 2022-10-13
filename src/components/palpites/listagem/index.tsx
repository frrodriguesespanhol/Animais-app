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
import { TextField } from '@mui/material'
import { Input } from 'components'

interface ConsultaPalpitesForm {
    data?: ''
    usuario?: ''
    //onSubmit?:() => void
}

// const formScheme = {
//     data: undefined,
//     usuario: undefined
// }

export const ListagemPalpites: React.FC = ({
        // data,
        // usuario,
        // onSubmit
    }) => {

    const palpiteService = usePalpiteService()
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ palpites, setPalpites ] = useState<Page<Palpites>>({
        content: [],
        first: 0,
        number: 0,
        size: 10,
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
        initialValues: { data: '', usuario: ''}
    })

    const handlePage = (event: DataTablePageParams) => {
        setLoading(true)
        console.log(filtro.data)
        palpiteService.find(filtro.data, filtro.usuario, event?.page, event?.rows)
                .then(result => {
                    setPalpites({...result, first: event?.first})
                }).finally(() => setLoading(false))
    }

    // não deleta, apenas atualiza
    // const deletar = (palpite: Palpites) => {
    //     palpiteService.deletar(palpite.id).then(result => {
    //         handlePage(null)
    //     })
    // }

    const actionTemplate = (registro: Palpites) => {
        const url = `/cadastros/palpites?id=${registro.id}`
        return (
            <div>
                <Button label="Palpitar"
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

    // const formik = useFormik({
    //     initialValues: {...formScheme},
    //     onSubmit,
    //     enableReinitialize: true,
    //     //validationSchema: validationScheme
    // })

    return (
        <Layout titulo="Palpites">
            <form onSubmit={formikSubmit}>
            
                          
                <div className='columns'>
                    <Input label="Data" id="data"
                        columnClasses='is-half'
                        autoComplete='off'
                        type="date"
                        onChange={handleChange}
                        name="data" value={filtro.data} />

                    {/* <TextField
                        name='data'
                        id='data'
                        value={formik.values.data}
                        //onChange={formik.handleChange}
                        >
                    </TextField> */}
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
                    <DataTable value={palpites.content}
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
                        <Column field='jogo.sel1.nome' header="Seleção 1" />
                        <Column field='gols_sel1' header="Gols Seleção 1" />
                        <Column field='gols_sel2' header="Gols Seleção 2" />
                        <Column field='jogo.sel2.nome' header="Seleção 2" />
                        <Column field='jogo.fase.nome' header="Fase" />
                        <Column body={actionTemplate} />
                    </DataTable>

                </div>

            </div>
        </Layout>
    )
}