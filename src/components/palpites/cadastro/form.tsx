import { Input } from 'components'
import { useFormik, useFormikContext, validateYupSchema } from 'formik'
import Router from 'next/router'
import { useState } from 'react'
import { Page } from 'app/models/common/page'
import { AutoComplete, AutoCompleteChangeParams, AutoCompleteCompleteMethodParams } from 'primereact/autocomplete'
import { Jogos } from 'app/models/jogos'
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { Palpites } from 'app/models/palpites'
import { useJogoService } from 'app/services/jogos.service'
import { Usuario } from 'app/models/usuarios'
import { useUsuarioService } from 'app/services'
import { usePalpiteService } from 'app/services/palpites.service'
import { resourceLimits } from 'worker_threads'
import { Alert } from 'components/common/message'

interface PalpitesFormProps {
    palpites: Palpites
    onSubmit: (palpites: Palpites) => void
}

interface proximoJogo {
    data: Date
    usuario: string 
    id: string
}


const formScheme: Palpites = {
    id: undefined,
    jogo: undefined,
    data_hora: undefined,
    gols_eq1: '',
    gols_eq2: '',
    usuario: undefined
}

export const PalpitesForm: React.FC<PalpitesFormProps> = ({
    palpites,
    onSubmit
}) => {

    const formik = useFormik<Palpites>({
        initialValues: {...formScheme, ...palpites},
        onSubmit,
        enableReinitialize: true,
        // validationSchema: validationScheme
    })

    const [ messages, setMessages ] = useState<Array<Alert>>([])
    const palpiteService = usePalpiteService()
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ palpites_, setPalpites_ ] = useState<Page<Palpites>>({
        content: [],
        first: 0,
        number: 0,
        size: 0,
        totalElements: 0
    })


    const jogoService = useJogoService()

    const [ listaJogos, setListaJogos ] = useState<Page<Jogos>>({
        content: [],
        first: 0,
        number: 0,
        size: 0,
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

    const handleJogosAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        jogoService
            .find(nome, '', 0, 20)
            .then(jogos => setListaJogos(jogos))
    }

    const handleJogoChange = (e: AutoCompleteChangeParams | any) => {
        const jogoSelecionado: Jogos = e.value
        formik.setFieldValue("jogo_eq1", jogoSelecionado)
        //console.log(jogoSelecionado)
    }

    const handleJogoChange2 = (e: AutoCompleteChangeParams) => {
        const jogoSelecionado: Jogos = e.value
        formik.setFieldValue("jogo_eq2", jogoSelecionado)
        //console.log(jogoSelecionado)
    }
    
    const handleUsuarioAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        usuarioService
            .find(nome, "", 0, 20)
            .then(usuarios => setListaUsuarios(usuarios))
    }

    const handleUsuarioChange = (e: AutoCompleteChangeParams) => {
        const usuarioSelecionado: Usuario = e.value
        formik.setFieldValue("usuario", usuarioSelecionado)
        //console.log(cidadeSelecionado)
    }

    const [valueData, setValueData] = useState<Date | null>(null)

    var gols1 = formik.values.gols_eq1
    if (gols1 === null){
        gols1 = ''
    }
    
    var gols2 = formik.values.gols_eq2
    if (gols2 === null){
        gols2 = ''
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
                        disabled
                        placeholder='Equipe 1 *'   
                        suggestions={listaJogos.content}
                        completeMethod={handleJogosAutoComplete}
                        value={formik.values.jogo}
                        field="eq1.nome"
                        id="jogo"
                        name="jogo"
                        onChange={handleJogoChange}
                        />
                    <small className='p-error p-d-block'>
                        {formik.errors.jogo}
                    </small>
                </div>
            </div>

                <div className='p-field'>
                    <TextField 
                        id='gols_eq1'
                        label='Gols'
                        type='number'
                        //value={formik.values.gols_eq1}
                        value={gols1}
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
                        id='gols_eq2'
                        label='Gols'
                        type='number'
                        //value={formik.values.gols_eq2}
                        value={gols2}
                        onChange={formik.handleChange}
                        >
                    </TextField>
                </div>

            <div className='p-fluid'>
                <div className='p-field'>
                    <AutoComplete    
                        disabled
                        placeholder='Equipe 2 *'   
                        suggestions={listaJogos.content}
                        completeMethod={handleJogosAutoComplete}
                        value={formik.values.jogo}
                        field="eq2.nome"
                        id="eq2"
                        name="eq2"
                        onChange={handleJogoChange2}
                        />
                    <small className='p-error p-d-block'>
                        {formik.errors.jogo}
                    </small>
                </div>
            </div>

            
            {/* <Stack spacing={2} direction='row'> */}
                {/* <div className='p-field'>
                    <TextField 
                        disabled
                        label="Hora da Aposta"
                        id='data_hora'
                        value={formik.values.data_hora}
                        onChange={formik.handleChange}
                        >
                    </TextField>
                </div> */}
               <div className='columns'>
                    <Input id="data_hora"
                        name="data_hora"
                        label="Horário da Aposta: "
                        autoComplete='off'
                        disabled
                        columnClasses='is-half'
                        value = {formik.values.data_hora || ''}
                    />
                </div>
            
            <div className='p-fluid'>
                <div className='p-field'>
                        
                        <AutoComplete
                            disabled
                            placeholder='Usuário *'
                            suggestions={listaUsuarios.content}
                            completeMethod={handleUsuarioAutoComplete}
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
            {/* </Stack> */}


                <div className='field is-grouped'>
                    <div className='control is-link'>
                        <button type='submit' className='button is-success'>
                            { formik.values.id ? "Atualizar" : "Salvar" }
                        </button>
                    </div>

                    {/* <div className='control is-link'>
                        <button type='button'
                                onClick={e => Router.push("/cadastros/palpites?id=")}
                                //onClick={e => procuraProximoJogo }
                                className='button is-info'>
                            Apostar no próximo
                        </button>
                    </div> */}

                    <div className='control is-link'>
                    <button type="button"
                            onClick={event => {
                            setLoading(true)
                            //console.log('entrou')
                            palpiteService.proximoJogo(formik.values.jogo?.data_hora, formik.values.usuario?.id, formik.values.jogo?.id)
                            .then(result => {
                                setPalpites_({...result, first: 0 })
                                if ( result.content.length > 0 ) {
                                    const aaa = result.content.map(id=> {
                                        return (id.id)
                                    })
                                    const id_ok = aaa.find(id_ok => id_ok )
                                    //console.log(id_ok) 
                                    Router.push("/cadastros/palpites?id=" + id_ok)
                                } else {
                                    alert("Não existem jogos para palpite posterior a esse!")
                                }
                            }).finally(() => setLoading(false))
                                
                            }
                        }
                        className='button is-info'>
                            Apostar no próximo
                    </button>
                    </div>

                </div>

                <div className='control is-link'>
                        <button type='button'
                                onClick={e => Router.push("/consultas/palpites")}
                                className='button'>
                            Voltar
                        </button>
                </div>
           
        </form>

    )
}