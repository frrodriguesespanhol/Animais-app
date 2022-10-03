import { Estadio } from 'app/models/estadios'
import { Input } from 'components'
import { useFormik } from 'formik'
import { validationScheme } from './validationSchema'
import Router from 'next/router'
import { useCidadeService } from 'app/services'
import { useState } from 'react'
import { Page } from 'app/models/common/page'
import { Cidade } from 'app/models/cidades'
import { AutoComplete, AutoCompleteChangeParams, AutoCompleteCompleteMethodParams } from 'primereact/autocomplete'

interface EstadioFormProps {
    estadio: Estadio
    onSubmit: (estadio: Estadio) => void
}

const formScheme: Estadio = {
    idCidade: undefined,
    nome: ''
}

export const EstadioForm: React.FC<EstadioFormProps> = ({
    estadio,
    onSubmit
}) => {

    const cidadeService = useCidadeService()
    const [ listaCidades, setListaCidades ] = useState<Page<Cidade>>({
        content: [],
        first: 0,
        number: 0,
        size: 0,
        totalElements: 0
    })


    const formik = useFormik<Estadio>({
        initialValues: {...formScheme, ...estadio},
        onSubmit,
        enableReinitialize: true,
        //validationSchema: validationScheme
    })

    const handleCidadeAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        cidadeService
            .find(nome, '', 0, 20)
            .then(cidades => setListaCidades(cidades))
    }

    const handleCidadeChange = (e: AutoCompleteChangeParams) => {
        const cidadeSelecionada: Cidade = e.value
        formik.setFieldValue("idCidade", cidadeSelecionada)
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
                    <label htmlFor="cidade">Cidade: *</label>
                    <AutoComplete
                        suggestions={listaCidades.content}
                        completeMethod={handleCidadeAutoComplete}
                        value={formik.values.idCidade}
                        field="nome"
                        id="idCidade"
                        name="idCidade"
                        onChange={handleCidadeChange}
                        />
                    <small className='p-error p-d-block'>
                        {formik.errors.idCidade}
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
                            onClick={e => Router.push("/consultas/estadios")}
                            className='button'>
                        Voltar
                    </button>
                </div>
            </div>
        </div>           
        </form>
    )
}