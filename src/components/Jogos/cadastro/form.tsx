import { Cidade } from 'app/models/cidades'
import { Input } from 'components'
import { useFormik, useFormikContext, validateYupSchema } from 'formik'
import { validationScheme } from './validationSchema'
import Router from 'next/router'
import { useCidadeService, useEstadioService, useEquipeService, useCampeonatoService } from 'app/services'
import { useState } from 'react'
import { Page } from 'app/models/common/page'
import { AutoComplete, AutoCompleteChangeParams, AutoCompleteCompleteMethodParams } from 'primereact/autocomplete'
import { Jogos } from 'app/models/jogos'
import { Equipes } from 'app/models/equipes'
import { useFaseService } from 'app/services/fases.service'
import { Fases } from 'app/models/fases'
import { Campeonato } from 'app/models/campeonatos'

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
    equ1: undefined,
    equ2: undefined,
    gols1: '',
    gols2: '',
    estadio: undefined,
    data_hora: undefined,
    fase: undefined,
    campeonato: undefined
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

    const equipeService = useEquipeService()

    const [ listaEquipes, setListaEquipes ] = useState<Page<Equipes>>({
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

    const campeonatoService = useCampeonatoService()

    const [ listaCampeonatos, setListaCampeonatos ] = useState<Page<Campeonato>>({
        content: [],
        first: 0,
        number: 0,
        size: 0,
        totalElements: 0
    })

    const handleEquipeAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        equipeService
            .find(nome, 0, 20)
            .then(equipes => setListaEquipes(equipes))
            //console.log(listaSelecoes.content)

    }

    const handleEquipeChange = (e: AutoCompleteChangeParams) => {
        const equipeSelecionada: Equipes = e.value
        formik.setFieldValue("equ1", equipeSelecionada)
        console.log(equipeSelecionada)
    }

    const handleEquipeChange2 = (e: AutoCompleteChangeParams) => {
        const equipeSelecionada: Equipes = e.value
        formik.setFieldValue("equ2", equipeSelecionada)
        console.log(equipeSelecionada)
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


    const handleCampeonatoAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        campeonatoService
            .find(nome, undefined, 0, 20)
            .then(campeonatos => setListaCampeonatos(campeonatos))
    }

    const handleCampeonatoChange = (e: AutoCompleteChangeParams) => {
        const campeonatoSelecionado: Campeonato = e.value
        formik.setFieldValue("campeonato", campeonatoSelecionado)
        console.log(campeonatoSelecionado)
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
                        placeholder='Equipe 1 *'   
                        suggestions={listaEquipes.content}
                        completeMethod={handleEquipeAutoComplete}
                        value={formik.values.equ1}
                        field="nome"
                        id="equ1"
                        name="equ1"
                        onChange={handleEquipeChange}
                    />
                    <small className='p-error p-d-block'>
                        {formik.errors.equ1}
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
                        placeholder='Equipe 2 *'   
                        suggestions={listaEquipes.content}
                        completeMethod={handleEquipeAutoComplete}
                        value={formik.values.equ2}
                        field="nome"
                        id="equ2"
                        name="equ2"
                        onChange={handleEquipeChange2}
                        />
                    <small className='p-error p-d-block'>
                        {formik.errors.equ2}
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