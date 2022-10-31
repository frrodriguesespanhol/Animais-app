import { Cidade } from 'app/models/cidades'
import { Input } from 'components'
import { useFormik, useFormikContext, validateYupSchema } from 'formik'
import { validationScheme } from './validationSchema'
import Router from 'next/router'
import { useCidadeService, useEstadioService, useSelecaoService } from 'app/services'
import { useState } from 'react'
import { Page } from 'app/models/common/page'
import { AutoComplete, AutoCompleteChangeParams, AutoCompleteCompleteMethodParams } from 'primereact/autocomplete'
import { Jogos } from 'app/models/jogos'
import { Selecoes } from 'app/models/selecoes'
import { useFaseService } from 'app/services/fases.service'
import { Fases } from 'app/models/fases'

import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import Stack from '@mui/material/Stack';
import { Estadio } from 'app/models/estadios'


interface JogosFormProps {
    jogos: Jogos
    onSubmit: (jogos: Jogos) => void
}

const formScheme: Jogos = {
    sel1: undefined,
    sel2: undefined,
    gols1: '',
    gols2: '',
    estadio: undefined,
    data_hora: undefined,
    fase: undefined
}

export const JogosForm: React.FC<JogosFormProps> = ({
    jogos,
    onSubmit
}) => {

    const formik = useFormik<Jogos>({
        initialValues: {...formScheme, ...jogos},
        onSubmit,
        enableReinitialize: true,
        // validationSchema: validationScheme
    })

    const selecaoService = useSelecaoService()

    const [ listaSelecoes, setListaSelecoes ] = useState<Page<Selecoes>>({
        content: [],
        first: 0,
        number: 0,
        size: 0,
        totalElements: 0
    })

    const estadioService = useEstadioService()

    const [ listaEstadios, setListaEstadios ] = useState<Page<Estadio>>({
        content: [],
        first: 0,
        number: 0,
        size: 0,
        totalElements: 0
    })

    const faseService = useFaseService()

    const [ listaFases, setListaFases ] = useState<Page<Fases>>({
        content: [],
        first: 0,
        number: 0,
        size: 0,
        totalElements: 0
    })

    const handleSelecaoAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        selecaoService
            .find(nome, 0, 20)
            .then(selecoes => setListaSelecoes(selecoes))
            //console.log(listaSelecoes.content)

    }

    const handleSelecaoChange = (e: AutoCompleteChangeParams) => {
        const selecaoSelecionada: Selecoes = e.value
        formik.setFieldValue("sel1", selecaoSelecionada)
        console.log(selecaoSelecionada)
    }

    const handleSelecaoChange2 = (e: AutoCompleteChangeParams) => {
        const selecaoSelecionada: Selecoes = e.value
        formik.setFieldValue("sel2", selecaoSelecionada)
        console.log(selecaoSelecionada)
    }

    const handleEstadioAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        estadioService
            .find(nome, "", 0, 20)
            .then(estadios => setListaEstadios(estadios))
    }

    const handleEstadioChange = (e: AutoCompleteChangeParams) => {
        const estadioSelecionado: Estadio = e.value
        formik.setFieldValue("estadio", estadioSelecionado)
        //console.log(cidadeSelecionado)
    }

    const handleFaseAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        faseService
            .find(nome, 0, 20)
            .then(fases => setListaFases(fases))
    }

    const handleFaseChange = (e: AutoCompleteChangeParams) => {
        const faseSelecionada: Fases = e.value
        formik.setFieldValue("fase", faseSelecionada)
        console.log(faseSelecionada)
    }


    const [valueData, setValueData] = useState<Date | null>(null)
        

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
                        placeholder='Seleção 1 *'   
                        suggestions={listaSelecoes.content}
                        completeMethod={handleSelecaoAutoComplete}
                        value={formik.values.sel1}
                        field="nome"
                        id="sel1"
                        name="sel1"
                        onChange={handleSelecaoChange}
                    />
                    <small className='p-error p-d-block'>
                        {formik.errors.sel1}
                    </small>
                </div>
            </div>

                <div className='p-field'>
                    <TextField 
                        //size='small'
                        id='gols1'
                        label='Gols'
                        type='number'
                        //margin='dense'
                        value={formik.values.gols1}
                        onChange={formik.handleChange}
                        >
                    </TextField>
                </div>
            
            
            <div className='p-field'>
                <div className='label'>
                    X
                </div>
            </div>

                <div className='p-field'>
                    <TextField 
                        //size='small'
                        id='gols2'
                        label='Gols'
                        type='number'
                        //margin='dense'
                        value={formik.values.gols2}
                        onChange={formik.handleChange}
                        >
                    </TextField>
                </div>

            <div className='p-fluid'>    
                <div className='p-field'>
                    <AutoComplete    
                        placeholder='Seleção 2 *'   
                        suggestions={listaSelecoes.content}
                        completeMethod={handleSelecaoAutoComplete}
                        value={formik.values.sel2}
                        field="nome"
                        id="sel2"
                        name="sel2"
                        onChange={handleSelecaoChange2}
                        />
                    <small className='p-error p-d-block'>
                        {formik.errors.sel2}
                    </small>
                </div>
            </div>
            
            <div className='p-fluid'>  
                <div className='p-field'>
                        <AutoComplete
                            placeholder='Estádio *'   
                            suggestions={listaEstadios.content}
                            completeMethod={handleEstadioAutoComplete}
                            value={formik.values.estadio}
                            field="nome"
                            id="estadio"
                            name="estadio"
                            onChange={handleEstadioChange}
                            />
                        <small className='p-error p-d-block'>
                            {formik.errors.estadio}
                        </small>
                </div>
            </div>

                <div className='p-field'>
                    <TextField 
                        id='data_hora'
                        label='Data / Hora'
                        //type='datetime-local'
                        value={formik.values.data_hora}
                        onChange={formik.handleChange}
                        >
                    </TextField>
                </div>
            
                {/* <div className='p-field'>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            ampm={false}
                            label="Data / Hora do Jogo"
                            renderInput={(params) => <TextField {...params} />} //id="dt" value={formik.values.data_hora} acrescentei isso mas não resolveu
                            //value={formik.values.sel1}
                            //inputFormat={'dd/MM/yyyy hh:mm'}
                            onChange={(newValue) => {
                                setValueData(newValue)
                            }}
                            //value={formik.values.data_hora}
                            value={valueData} // não consegue pegar aqui
                        />
                    </LocalizationProvider>
                </div> */}

            <div className='p-fluid'>  
                <div className='p-field'>
                        <AutoComplete
                            placeholder='Fase *'
                            suggestions={listaFases.content}
                            completeMethod={handleFaseAutoComplete}
                            value={formik.values.fase}
                            field="nome"
                            id="fase"
                            name="fase"
                            onChange={handleFaseChange}
                            />
                        <small className='p-error p-d-block'>
                            {formik.errors.fase}
                        </small>
                </div>
            </div>


                <div className='field is-grouped'>
                    <div className='control is-link'>
                        <button type='submit' className='button is-success'>
                            { formik.values.id ? "Atualizar" : "Salvar" }
                        </button>
                    </div>
                    
                    <div className='control is-link'>
                        <button type='button'
                                onClick={e => Router.push("/consultas/jogos")}
                                className='button'>
                            Voltar
                        </button>
                    </div>
                </div>
           
        </form>
    )
}