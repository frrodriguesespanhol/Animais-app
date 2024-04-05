import { Grupos } from 'app/models/grupos'
import { Input } from 'components'
import { useFormik } from 'formik'
import { validationScheme } from './validationSchema'
import Router from 'next/router'

interface GruposFormProps {
    grupo: Grupos
    onSubmit: (grupo: Grupos) => void
}

const formScheme: Grupos = {
    nome: ''
}

export const GruposForm: React.FC<GruposFormProps> = ({
    grupo,
    onSubmit
}) => {

    const formik = useFormik<Grupos>({
        initialValues: {...formScheme, ...grupo},
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
                       label="Grupo: *"
                       autoComplete='off'
                       columnClasses='is-full'
                       value={formik.values.nome}
                       onChange={formik.handleChange}
                       error={formik.errors.nome}
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
                            onClick={e => Router.push("/consultas/grupos")}
                            className='button'>
                        Voltar
                    </button>
                </div>
            </div>
            
        </form>
    )
}