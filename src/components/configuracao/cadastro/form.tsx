import { Input } from 'components'
import { useFormik, useFormikContext, validateYupSchema } from 'formik'
import { validationScheme } from './validationSchema'
import Router from 'next/router'
import { useCidadeService, useCampeonatoService, useEmpresaService, useEstadioService, useEquipeService } from 'app/services'
import { useState } from 'react'
import { Page } from 'app/models/common/page'
import { AutoComplete, AutoCompleteChangeParams, AutoCompleteCompleteMethodParams } from 'primereact/autocomplete'
import { Jogos } from 'app/models/jogos'
import { Equipes } from 'app/models/equipes'
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { Campeonato } from 'app/models/campeonatos'
import { Empresas } from 'app/models/empresas'
import { Configuracao } from 'app/models/configuracao'

interface ConfiguracaoFormProps {
    configuracao: Configuracao
    onSubmit: (configuracao: Configuracao) => void
}

const formScheme: Configuracao = {
    empresa: undefined,
    campeonato: undefined,
    pontos_cravada: undefined,
    pontos_acerto: undefined,
    pontos_erro: undefined
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

    const campeonatoService = useCampeonatoService()

    const [ listaCampeonatos, setListaCampeonatos ] = useState<Page<Campeonato>>({
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
    
    const handleCampeonatoAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        campeonatoService
            .find(nome, "", 0, 20)
            .then(campeonatos => setListaCampeonatos(campeonatos))
    }

    const handleCampeonatoChange = (e: AutoCompleteChangeParams) => {
        const campeonatoSelecionado: Campeonato = e.value
        formik.setFieldValue("campeonato", campeonatoSelecionado)
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
            
            <div className='p-fluid'>
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
            </div>

            <div className='p-fluid'>
                <div className='p-field'>
                    <AutoComplete    
                        placeholder='Campeonato *'   
                        suggestions={listaCampeonatos.content}
                        completeMethod={handleCampeonatoAutoComplete}
                        value={formik.values.campeonato}
                        field="nome"
                        id="campeonato"
                        name="campeonato"
                        onChange={handleCampeonatoChange}
                        />
                    <small className='p-error p-d-block'>
                        {formik.errors.campeonato}
                    </small>
                </div>
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