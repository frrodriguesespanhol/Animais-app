import { Cidade } from 'app/models/cidades'
import { Input } from 'components'
import { useFormik } from 'formik'
import { validationScheme } from './validationSchema'
import Router from 'next/router'
import { useCidadeService, useCopaService, useSelecaoService } from 'app/services'
import { useState } from 'react'
import { Page } from 'app/models/common/page'
import { Copa } from 'app/models/copas'
import { AutoComplete, AutoCompleteChangeParams, AutoCompleteCompleteMethodParams } from 'primereact/autocomplete'
import { Jogos } from 'app/models/Jogos'
import { Selecoes } from 'app/models/selecoes'

interface JogosFormProps {
    jogos: Jogos
    onSubmit: (jogos: Jogos) => void
}

const formScheme: Jogos = {
    sel1: undefined,
    sel2: undefined,
    gols1: '',
    gols2: '',
    cidade: undefined,
    data_hora: '',
    fase: ''
}

export const JogosForm: React.FC<JogosFormProps> = ({
    jogos,
    onSubmit
}) => {

    const selecaoService = useSelecaoService()

    const [ listaSelecoes, setListaSelecoes ] = useState<Page<Selecoes>>({
        content: [],
        first: 0,
        number: 0,
        size: 0,
        totalElements: 0
    })

    const cidadeService = useCidadeService()

    const [ listaCidades, setListaCidades ] = useState<Page<Cidade>>({
        content: [],
        first: 0,
        number: 0,
        size: 0,
        totalElements: 0
    })

    const formik = useFormik<Jogos>({
        initialValues: {...formScheme, ...jogos},
        onSubmit,
        enableReinitialize: true,
        validationSchema: validationScheme
    })

    const handleSelecaoAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        selecaoService
            .find(nome, 0, 20)
            .then(selecoes => setListaSelecoes(selecoes))
    }

    const handleSelecaoChange = (e: AutoCompleteChangeParams) => {
        const selecaoSelecionada: Selecoes = e.value
        formik.setFieldValue("nome", selecaoSelecionada)
        console.log(selecaoSelecionada)
    }

    const handleCidadeAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        cidadeService
            .find(nome, "", 20)
            .then(cidades => setListaCidades(cidades))
    }

    const handleCidadeChange = (e: AutoCompleteChangeParams) => {
        const cidadeSelecionada: Cidade = e.value
        formik.setFieldValue("nome", cidadeSelecionada)
        console.log(cidadeSelecionada)
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

                <div className='p-field'>
                    <label htmlFor="sel1">Seleção 1: *</label>
                    <AutoComplete
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

                <div className='p-fluid'>
                    <div className='columns'>
                        <Input id="gols1"
                            name="gols1"
                            label="Gols Seleção 1: *"
                            autoComplete='off'
                            columnClasses='is-full'
                            value={formik.values.gols1}
                            onChange={formik.handleChange}
                            error={formik.errors.gols1}
                        />
                     </div>
                </div>

                <div className='p-field'>
                    <label htmlFor="sel2">Seleção 2: *</label>
                    <AutoComplete
                        suggestions={listaSelecoes.content}
                        completeMethod={handleSelecaoAutoComplete}
                        value={formik.values.sel1}
                        field="nome"
                        id="sel2"
                        name="sel2"
                        onChange={handleSelecaoChange}
                        />
                    <small className='p-error p-d-block'>
                        {formik.errors.sel2}
                    </small>
                </div>

                <div className='p-fluid'>
                    <div className='columns'>
                        <Input id="gols2"
                            name="gols2"
                            label="Gols Seleção 2: *"
                            autoComplete='off'
                            columnClasses='is-full'
                            value={formik.values.gols2}
                            onChange={formik.handleChange}
                            error={formik.errors.gols2}
                        />
                     </div>
                </div>

            <div className='p-field'>
                    <label htmlFor="cidade">Cidade: *</label>
                    <AutoComplete
                        suggestions={listaCidades.content}
                        completeMethod={handleCidadeAutoComplete}
                        value={formik.values.cidade}
                        field="nome"
                        id="cidade"
                        name="cidade"
                        onChange={handleCidadeChange}
                        />
                    <small className='p-error p-d-block'>
                        {formik.errors.cidade}
                    </small>
            </div>

            <div className='p-fluid'>
                <div className='columns'>
                    <Input id="data_hora"
                        name="data_hora"
                        label="Data e Hora do Jogo: *"
                        autoComplete='off'
                        columnClasses='is-full'
                        value={formik.values.data_hora}
                        onChange={formik.handleChange}
                        error={formik.errors.data_hora}
                    />
                </div>
            </div>

            <div className='p-fluid'>
                <div className='columns'>
                    <Input id="fase"
                        name="fase"
                        label="Fase: *"
                        autoComplete='off'
                        columnClasses='is-full'
                        value={formik.values.fase}
                        onChange={formik.handleChange}
                        error={formik.errors.fase}
                    />
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
                            onClick={e => Router.push("/consultas/cidades")}
                            className='button'>
                        Voltar
                    </button>
                </div>
            </div>
        
        </form>
    )
}