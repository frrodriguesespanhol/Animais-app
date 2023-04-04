import { Cidade } from 'app/models/cidades'
import { Input } from 'components'
import { useFormik } from 'formik'
import { validationScheme } from './validationSchema'
import Router from 'next/router'
import { useCampeonatoService } from 'app/services'
import { useState } from 'react'
import { Page } from 'app/models/common/page'
import { Campeonato } from 'app/models/campeonatos'
import { AutoComplete, AutoCompleteChangeParams, AutoCompleteCompleteMethodParams } from 'primereact/autocomplete'

interface CidadeFormProps {
    cidade: Cidade
    onSubmit: (cidade: Cidade) => void
}

const formScheme: Cidade = {
    idCampeonato: undefined,
    nome: ''
}

export const CidadeForm: React.FC<CidadeFormProps> = ({
    cidade,
    onSubmit
}) => {

    const campeonatoService = useCampeonatoService()
    const [ listaCampeonatos, setListaCampeonatos ] = useState<Page<Campeonato>>({
        content: [],
        first: 0,
        number: 0,
        size: 0,
        totalElements: 0
    })


    const formik = useFormik<Cidade>({
        initialValues: {...formScheme, ...cidade},
        onSubmit,
        enableReinitialize: true,
        validationSchema: validationScheme
    })

    const handleCampeonatoAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        campeonatoService
            .find(nome, '', 0, 20)
            .then(campeonatos => setListaCampeonatos(campeonatos))
    }

    const handleCampeonatoChange = (e: AutoCompleteChangeParams) => {
        const campeonatoSelecionado: Campeonato = e.value
        formik.setFieldValue("idCampeonato", campeonatoSelecionado)
        console.log(campeonatoSelecionado)
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
            <div className='columns'>
                <Input id="nome"
                       name="nome"
                       label="Nome: *"
                       autoComplete='off'
                       columnClasses='is-full'
                       value={formik.values.nome}
                       onChange={formik.handleChange}
                       error={formik.errors.nome}
                />
            </div>

            <div className='p-field'>
                    <label htmlFor="campeonato">Campeonato: *</label>
                    <AutoComplete
                        suggestions={listaCampeonatos.content}
                        completeMethod={handleCampeonatoAutoComplete}
                        value={formik.values.idCampeonato}
                        field="nome"
                        id="idCampeonato"
                        name="idCampeonato"
                        onChange={handleCampeonatoChange}
                        />
                    <small className='p-error p-d-block'>
                        {formik.errors.idCampeonato}
                    </small>
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
        </div>           
        </form>
    )
}