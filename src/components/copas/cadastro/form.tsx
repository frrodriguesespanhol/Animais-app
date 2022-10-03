import { Copa } from 'app/models/copas'
import { Input } from 'components'
import { useFormik } from 'formik'
import { validationScheme } from './validationSchema'
import Router from 'next/router'
import { SessionProvider } from 'next-auth/react'

interface CopaFormProps {
    copa: Copa
    onSubmit: (copa: Copa) => void
}

const formScheme: Copa = {
    nome: '',
    ano: ''
}

export const CopaForm: React.FC<CopaFormProps> = ({
    copa,
    onSubmit
}) => {

    const formik = useFormik<Copa>({
        initialValues: {...formScheme, ...copa},
        onSubmit,
        enableReinitialize: true,
        validationSchema: validationScheme
    })

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
            <div className='columns'>
                <Input id="ano"
                       name="ano"
                       label="Ano: *"
                       autoComplete='off'
                       columnClasses='is-half'
                       value={formik.values.ano}
                       onChange={formik.handleChange}
                       error={formik.errors.ano}
                />
            </div>

            <div className='field is-grouped'>
                <div className='control is-link'>
                    <button type='submit' className='button is-success'>
                        { formik.values.id ? "Atualizar" : "Salvar" }
                    </button>
                </div>
                
                <div className='control is-link'>
                    <button type='button'
                            onClick={e => Router.push("/consultas/copas")}
                            className='button'>
                        Voltar
                    </button>
                </div>
            </div>
            
        </form>

        
    )
}