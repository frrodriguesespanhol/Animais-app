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
import { AutoComplete, AutoCompleteChangeParams, AutoCompleteCompleteMethodParams } from 'primereact/autocomplete'
import { Empresas } from 'app/models/empresas'
import { Configuracao } from 'app/models/configuracao'
import { Copa } from 'app/models/copas'
import { useCopaService, useEmpresaService } from 'app/services'
import { useConfiguracaoService } from 'app/services/configuracao.service'

let cS_empresa: string | undefined
let cs_copa: string | undefined

interface ConsultaConfiguracaoForm {
    empresa?: Empresas,
    empresa_1?: number,
    copa?: Copa,
    copa_1?: number,
    onSubmit?: (configuracao: Configuracao) => void
}

const formScheme: Configuracao = {
    empresa: undefined,
    copa: undefined
}

export const ListagemConfiguracao: React.FC<ConsultaConfiguracaoForm> = ({
        empresa,
        empresa_1,
        copa,
        copa_1,
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

    const copaService = useCopaService()
    const [ listaCopas, setListaCopas ] = useState<Page<Copa>>({
        content: [],
        first: 0,
        number: 0,
        size: 0,
        totalElements: 0
    })

    const configuracaoService = useConfiguracaoService()
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ configuracao, setConfiguracao ] = useState<Page<Configuracao>>({
        content: [],
        first: 0,
        number: 0,
        size: 10,
        totalElements: 0
    })

    const handleSubmit = (filtro: ConsultaConfiguracaoForm) => {
        handlePage(null)
    }

    const {
        handleSubmit: formikSubmit,
        values: filtro,
    } = useFormik<ConsultaConfiguracaoForm>({
        onSubmit: handleSubmit,
        initialValues: { empresa: undefined, empresa_1: 0, copa: undefined, copa_1: 0 }
    })

    const handlePage = (event: DataTablePageParams | any) => {
        setLoading(true)
        console.log(cS_empresa + " - " + cs_copa)
        configuracaoService.find(cS_empresa, cs_copa, event?.page, event?.rows)
                .then(result => {
                    setConfiguracao({...result, first: event?.first})
                }).finally(() => setLoading(false))
    }

    const deletar = (configuracao: Configuracao) => {
        configuracaoService.deletar(configuracao.id).then(result => {
            handlePage(null)
        })
    }

    const actionTemplate = (registro: Configuracao) => {
        const url = `/cadastros/configuracao?id=${registro.id}`
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

    const formik = useFormik<Configuracao>({
        initialValues: {...formScheme},
        onSubmit(values, formikHelpers) {
            
        },
        enableReinitialize: true,
        //validationSchema: validationScheme
    })

    const handleEmpresasAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        empresaService
            .find(nome, 0, 20)
            .then(empresa => setListaEmpresas(empresa))
    }

    const handleEmpresaChange = (e: AutoCompleteChangeParams) => {
        const empresaSelecionada: Empresas = e.value
        formik.setFieldValue("empresa", empresaSelecionada)
        cS_empresa = empresaSelecionada.id
        console.log(empresaSelecionada)
    }

    const handleCopaAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        copaService
            .find(nome, '', 0, 20)
            .then(copas => setListaCopas(copas))
    }

    const handleCopaChange = (e: AutoCompleteChangeParams) => {
        const copaSelecionada: Copa = e.value
        formik.setFieldValue("copa", copaSelecionada)
        cs_copa = copaSelecionada.id
        console.log(copaSelecionada)
    }


    return (
        <Layout titulo="Configurações">
            <form onSubmit={formikSubmit}>
            
            <div className='p-fluid'>
                
                <div className='p-field'>
                    <label htmlFor="empresa">Empresa: *</label>
                    <AutoComplete
                        suggestions={listaEmpresas.content}
                        completeMethod={handleEmpresasAutoComplete}
                        value={formik.values.empresa}
                        field="nome"
                        id="empresa"
                        name="empresa"
                        onChange={handleEmpresaChange}
                        />
                    <small className='p-error p-d-block'>
                        {formik.errors.empresa}
                    </small>
                </div>

                <div className='p-field'>
                    <label htmlFor="copa">Copa: *</label>
                    <AutoComplete
                        suggestions={listaCopas.content}
                        completeMethod={handleCopaAutoComplete}
                        value={formik.values.copa}
                        field="nome"
                        id="copa"
                        name="copa"
                        onChange={handleCopaChange}
                        />
                    <small className='p-error p-d-block'>
                        {formik.errors.copa}
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
                                onClick={e => Router.push("/cadastros/configuracao")}
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
                    <DataTable value={configuracao.content}
                            totalRecords={configuracao.totalElements}
                            lazy paginator
                            first={configuracao.first}
                            rows={configuracao.size}
                            onPage={handlePage}
                            loading={loading}
                            emptyMessage="Nenhum registro."
                            >
                        <Column field='empresa.nome' header="Empresa" />
                        <Column field='copa.nome' header="Copa" />
                        <Column field='pontos_cravada' header="Pontos - Cravada" />
                        <Column field='pontos_acerto' header="Pontos - Acerto" />
                        <Column field='pontos_erro' header="Pontos - Erro" />
                        <Column body={actionTemplate} />
                    </DataTable>

                </div>

            </div>
        </Layout>
    )
}