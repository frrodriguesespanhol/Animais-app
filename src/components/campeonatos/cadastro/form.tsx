import { Campeonato } from 'app/models/campeonatos'
import { Input } from 'components'
import { useFormik } from 'formik'
import { validationScheme } from './validationSchema'
import Router from 'next/router'

interface CampeonatoFormProps {
    campeonato: Campeonato
    onSubmit: (campeonato: Campeonato) => void
}

const formScheme: Campeonato = {
    nome: '',
    ano: ''
}

export const CampeonatoForm: React.FC<CampeonatoFormProps> = ({
    campeonato,
    onSubmit
}) => {

    const formik = useFormik<Campeonato>({
        initialValues: {...formScheme, ...campeonato},
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
                            onClick={e => Router.push("/consultas/campeonatos")}
                            className='button'>
                        Voltar
                    </button>
                </div>
            </div>
            
        </form>

        
    )
}