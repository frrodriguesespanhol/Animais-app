import { Input } from 'components'
import { useFormik, useFormikContext, validateYupSchema } from 'formik'
import { validationScheme } from './validationSchema'
import Router from 'next/router'
import { useCidadeService, useCopaService, useEmpresaService, useEstadioService, useSelecaoService } from 'app/services'
import { useState } from 'react'
import { Page } from 'app/models/common/page'
import { AutoComplete, AutoCompleteChangeParams, AutoCompleteCompleteMethodParams } from 'primereact/autocomplete'
import { Jogos } from 'app/models/jogos'
import { Selecoes } from 'app/models/selecoes'
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { Copa } from 'app/models/copas'
import { Empresas } from 'app/models/empresas'

interface ConfiguracaoFormProps {
    configuracao: Configuracao
    onSubmit: (configuracao: Configuracao) => void
}

const formScheme: Configuracao = {
    empresa: undefined,
    copa: undefined,
    pontos_cravada: '',
    pontos_acerto: '',
    pontos_erro: ''
}

export const ConfiguracaoForm: React.FC<ConfiguracaoFormProps> = ({
    configuracao,
    onSubmit
}) => {

    const formik = useFormik<Configuracao>({
        initialValues: {...formScheme, ...configuracao},
        onSubmit,
        enableReinitialize: true,
        // validationSchema: validationScheme
    })

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

        const handleEmpresaAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        empresaService
            .find(nome, 0, 20)
            .then(empresas => setListaEmpresas(empresas))
            //console.log(listaSelecoes.content)

    }

    const handleEmpresaChange = (e: AutoCompleteChangeParams) => {
        const empresaSelecionada: Empresas = e.value
        formik.setFieldValue("empresa", empresaSelecionada)
        console.log(empresaSelecionada)
    }
    
    const handleCopaAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        copaService
            .find(nome, "", 0, 20)
            .then(copas => setListaCopas(copas))
    }

    const handleCopaChange = (e: AutoCompleteChangeParams) => {
        const copaSelecionada: Copa = e.value
        formik.setFieldValue("copa", copaSelecionada)
        //console.log(cidadeSelecionado)
    }
            
    return (
        <form onSubmit={formik.handleSubmit}>
            {formik.values.id &&
                <div className='columns'>
                    <Input id="id"
                        name="id"
                        label="Código: "
                        autoComplete='off'
                        disabled
                        columnClasses='is-half'
                        value={formik.values.id}
                    />
                </div>
            }
            
            <Stack spacing={4} direction='row'>
                <div className='p-field'>
                    <AutoComplete    
                        placeholder='Empresa *'   
                        suggestions={listaEmpresas.content}
                        completeMethod={handleEmpresaAutoComplete}
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
                    <AutoComplete    
                        placeholder='Copa *'   
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

                <div className='p-field'>
                    <TextField 
                        //size='small'
                        id='pontos_cravada'
                        label='Pontos - Cravada'
                        type='number'
                        //margin='dense'
                        value={formik.values.pontos_cravada}
                        onChange={formik.handleChange}
                        >
                    </TextField>
                </div>

                <div className='p-field'>
                    <TextField 
                        id='pontos_acerto'
                        label='Pontos - Acerto'
                        type='number'
                        value={formik.values.pontos_acerto}
                        onChange={formik.handleChange}
                        >
                    </TextField>
                </div>

                <div className='p-field'>
                    <TextField 
                        id='pontos_erro'
                        label='Pontos - Erro'
                        type='number'
                        value={formik.values.pontos_erro}
                        onChange={formik.handleChange}
                        >
                    </TextField>
                </div>
            
            </Stack>
            
            <div className='field is-grouped'>
                <div className='control is-link'>
                     <button type='submit' className='button is-success'>
                        { formik.values.id ? "Atualizar" : "Salvar" }
                     </button>
                </div>
                    
                <div className='control is-link'>
                     <button type='button'
                        onClick={e => Router.push("/consultas/configuracao")}
                        className='button'>
                        Voltar
                     </button>
                </div>
            </div>
           
        </form>
    )
}