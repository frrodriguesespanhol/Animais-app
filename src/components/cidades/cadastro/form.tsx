import { Cidade } from 'app/models/cidades'
import { Input } from 'components'
import { useFormik } from 'formik'
import { validationScheme } from './validationSchema'
import Router from 'next/router'
import { useCopaService } from 'app/services'
import { useState } from 'react'
import { Page } from 'app/models/common/page'
import { Copa } from 'app/models/copas'
import { AutoComplete, AutoCompleteChangeParams, AutoCompleteCompleteMethodParams } from 'primereact/autocomplete'

interface CidadeFormProps {
    cidade: Cidade
    onSubmit: (cidade: Cidade) => void
}

const formScheme: Cidade = {
    idcopa: undefined,
    nome: ''
}

export const CidadeForm: React.FC<CidadeFormProps> = ({
    cidade,
    onSubmit
}) => {

    const copaService = useCopaService()
    const [ listaCopas, setListaCopas ] = useState<Page<Copa>>({
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

    const handleCopaAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        copaService
            .find(nome, '', 0, 20)
            .then(copas => setListaCopas(copas))
    }

    const handleCopaChange = (e: AutoCompleteChangeParams) => {
        const copaSelecionada: Copa = e.value
        formik.setFieldValue("idcopa", copaSelecionada)
        console.log(copaSelecionada.id)
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
                    <label htmlFor="copa">Copa: *</label>
                    <AutoComplete
                        suggestions={listaCopas.content}
                        completeMethod={handleCopaAutoComplete}
                        value={formik.values.idcopa}
                        field="nome"
                        id="copa"
                        name="copa"
                        onChange={handleCopaChange}
                        />
                    <small className='p-error p-d-block'>
                        {formik.errors.idcopa}
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