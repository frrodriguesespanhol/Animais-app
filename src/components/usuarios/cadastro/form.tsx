import { Usuario } from 'app/models/usuarios'
import { Input } from 'components'
import { useFormik } from 'formik'
import { validationScheme } from './validationSchema'
import Router from 'next/router'
import { useState } from 'react'
import { Page } from 'app/models/common/page'
import { AutoComplete, AutoCompleteChangeParams, AutoCompleteCompleteMethodParams } from 'primereact/autocomplete'
import { Dropdown } from 'primereact/dropdown'

interface UsuarioFormProps {
    usuario: Usuario
    onSubmit: (usuario: Usuario) => void
}

const formScheme: Usuario = {
    nome: '',
    email:'',
    senha:'',
    tipo: ''
    
}

export const UsuarioForm: React.FC<UsuarioFormProps> = ({
    usuario,
    onSubmit
}) => {


    const formik = useFormik<Usuario>({
        initialValues: {...formScheme, ...usuario},
        onSubmit,
        enableReinitialize: true,
        validationSchema: validationScheme
    })


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