import { Empresas } from 'app/models/empresas'
import { Input } from 'components'
import { useFormik } from 'formik'
import { validationScheme } from './validationSchema'
import Router from 'next/router'

interface EmpresaFormProps {
    empresa: Empresas
    onSubmit: (empresa: Empresas) => void
}

const formScheme: Empresas = {
    nome: '',
    cidade: ''
}

export const EmpresaForm: React.FC<EmpresaFormProps> = ({
    empresa,
    onSubmit
}) => {

    const formik = useFormik<Empresas>({
        initialValues: {...formScheme, ...empresa},
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
                <Input id="cidade"
                       name="cidade"
                       label="Cidade: *"
                       autoComplete='off'
                       columnClasses='is-full'
                       value={formik.values.cidade}
                       onChange={formik.handleChange}
                       error={formik.errors.cidade}
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
                            onClick={e => Router.push("/consultas/empresas")}
                            className='button'>
                        Voltar
                    </button>
                </div>
            </div>
            
        </form>
    )
}