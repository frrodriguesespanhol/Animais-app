import { Usuario } from 'app/models/usuarios'
import { Input } from 'components'
import { useFormik } from 'formik'
import { validationScheme } from './validationSchema'
import Router from 'next/router'
import { useState } from 'react'
import { Page } from 'app/models/common/page'
import { AutoComplete, AutoCompleteChangeParams, AutoCompleteCompleteMethodParams } from 'primereact/autocomplete'
import { Empresas } from 'app/models/empresas'
import { useEmpresaService } from 'app/services/empresas.service'
import { Dropdown } from 'primereact/dropdown'

interface UsuarioFormProps {
    usuario: Usuario
    onSubmit: (usuario: Usuario) => void
}

const formScheme: Usuario = {
    nome: '',
    email:'',
    senha:'',
    idEmpresa: undefined,
    tipo: ''
    
}

export const UsuarioForm: React.FC<UsuarioFormProps> = ({
    usuario,
    onSubmit
}) => {

    const EmpresaService = useEmpresaService()
    const [ listaEmpresas, setListaEmpresas ] = useState<Page<Empresas>>({
        content: [],
        first: 0,
        number: 0,
        size: 0,
        totalElements: 0
    })


    const formik = useFormik<Usuario>({
        initialValues: {...formScheme, ...usuario},
        onSubmit,
        enableReinitialize: true,
        validationSchema: validationScheme
    })

    const handleEmpresaAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        EmpresaService
            .find(nome, '', 0, 20)
            .then(empresas => setListaEmpresas(empresas))
    }

    const handleEmpresaChange = (e: AutoCompleteChangeParams) => {
        const empresaSelecionada: Empresas = e.value
        formik.setFieldValue("idEmpresa", empresaSelecionada)
        console.log(empresaSelecionada)
    }

    const tipoUsuario: String[] = ["Usuário", "Administrador", "Administrador Geral"]

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

            <div className='columns'>
                <Input id="email"
                       name="email"
                       label="E-mail: *"
                       autoComplete='off'
                       columnClasses='is-full'
                       value={formik.values.email}
                       onChange={formik.handleChange}
                       error={formik.errors.email}
                />
            </div>

            <div className='columns'>
                <Input id="senha"
                       type="password"
                       name="senha"
                       label="Senha: *"
                       autoComplete='off'
                       columnClasses='is-full'
                       value={formik.values.senha}
                       onChange={formik.handleChange}
                       error={formik.errors.senha}
                />
            </div>

            <div className='p-field'>
                    <label htmlFor="copa">Empresa: *</label>
                    <AutoComplete
                        suggestions={listaEmpresas.content}
                        completeMethod={handleEmpresaAutoComplete}
                        value={formik.values.idEmpresa}
                        field="nome"
                        id="idEmpresa"
                        name="idEmpresa"
                        onChange={handleEmpresaChange}
                        />
                    <small className='p-error p-d-block'>
                        {formik.errors.idEmpresa}
                    </small>
            </div>

            <div className='p-field'>
                <label htmlFor="tipo">Tipo de Usuário: *</label>
                <Dropdown id="formaPagamento"
                     options={tipoUsuario}
                     value={formik.values.tipo}
                     onChange={e => formik.setFieldValue("tipo", e.value)}
                     placeholder="Selecione ..."
                />
                <small className='p-error p-d-block'>
                     {formik.touched && formik.errors.tipo}
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
                            onClick={e => Router.push("/consultas/usuarios")}
                            className='button'>
                        Voltar
                    </button>
                </div>
            </div>
        </div>           
        </form>
    )
}