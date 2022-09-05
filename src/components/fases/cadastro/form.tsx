import { Fases } from 'app/models/fases'
import { Input } from 'components'
import { useFormik } from 'formik'
import { validationScheme } from './validationSchema'
import Router from 'next/router'

interface FaseFormProps {
    fase: Fases
    onSubmit: (fase: Fases) => void
}

const formScheme: Fases = {
    nome: ''
}

export const FaseForm: React.FC<FaseFormProps> = ({
    fase,
    onSubmit
}) => {

    const formik = useFormik<Fases>({
        initialValues: {...formScheme, ...fase},
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
                       label="Fase: *"
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
                            onClick={e => Router.push("/consultas/fases")}
                            className='button'>
                        Voltar
                    </button>
                </div>
            </div>
            
        </form>
    )
}