import { Cidade } from 'app/models/cidades'
import { Input } from 'components'
import { useFormik } from 'formik'
import { validationScheme } from './validationSchema'
import Router from 'next/router'
import { usePaisesService } from 'app/services/paises.service'
import { useState } from 'react'
import { Page } from 'app/models/common/page'
import { Paises } from 'app/models/paises'
import { AutoComplete, AutoCompleteChangeParams, AutoCompleteCompleteMethodParams } from 'primereact/autocomplete'

interface CidadeFormProps {
    cidade: Cidade
    onSubmit: (cidade: Cidade) => void
}

const formScheme: Cidade = {
    idPais: undefined,
    nome: ''
}

export const CidadeForm: React.FC<CidadeFormProps> = ({
    cidade,
    onSubmit
}) => {

    const paisesService = usePaisesService()
    const [ listaPaises, setListaPaises ] = useState<Page<Paises>>({
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

    const handlePaisAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        paisesService
            .find(nome, 0, 20)
            .then(paises => setListaPaises(paises))
    }

    const handlePaisChange = (e: AutoCompleteChangeParams) => {
        const paisSelecionado: Paises = e.value
        formik.setFieldValue("idPais", paisSelecionado)
        console.log(paisSelecionado)
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
                    <label htmlFor="pais">País: *</label>
                    <AutoComplete
                        suggestions={listaPaises.content}
                        completeMethod={handlePaisAutoComplete}
                        value={formik.values.idPais}
                        field="nome"
                        id="idPais"
                        name="idPais"
                        onChange={handlePaisChange}
                        />
                    <small className='p-error p-d-block'>
                        {formik.errors.idPais}
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