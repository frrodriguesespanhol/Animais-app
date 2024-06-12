import { Animais } from 'app/models/animais'
import { Input } from 'components'
import { Formik, useFormik } from 'formik'
import { validationScheme } from './validationSchema'
import Router from 'next/router'
import { useClassificacaoService, useEspecieService, useGrupoService } from 'app/services'
import { useEffect, useState } from 'react'
import { Page } from 'app/models/common/page'
import { Grupos } from 'app/models/grupos'
import { AutoComplete, AutoCompleteChangeParams, AutoCompleteCompleteMethodParams } from 'primereact/autocomplete'
import { Classificacao } from 'app/models/classificacao'
import { Especie } from 'app/models/especies'
//import { CldUploadWidget } from 'next-cloudinary';
//import { Toast } from 'components/Toast'
import { UploadLoading } from 'components/UploadLoading'
import { ImagePreview } from 'components/ImagePreview'
import { UploadImage } from 'components/UploadImage'
import { signOut, useSession } from "next-auth/client"


let cS_grupo: string | undefined
let cS_classificacao: string | undefined
let cS_especie: string | undefined

interface AnimaisFormProps {
    animais: Animais
    onSubmit: (animais: Animais) => void
}

const formScheme: Animais = {
    data: undefined,
    idGrupoAnimal: undefined,
    idClassificacaoAnimal: undefined,
    idEspecieAnimal: undefined,
    especie: '',
    localizacao: '',
    cadastradopor: '',
    email: '',
    estado: '',
    comentario: '',
    foto1: '',
    foto2: ''
}


export const AnimaisForm: React.FC<AnimaisFormProps> = ({
    animais,
    onSubmit
}) => {

    const grupoService = useGrupoService()
    const [ listaGrupos, setListaGrupos ] = useState<Page<Grupos>>({
        content: [],
        first: 0,
        number: 0,
        size: 0,
        totalElements: 0
    })

    const formik = useFormik<Animais>({
        initialValues: {...formScheme, ...animais},
        onSubmit,
        enableReinitialize: true,
        validationSchema: validationScheme
    })

    const handleGrupoAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        grupoService
            .find(nome, 0, 20)
            .then(grupos => setListaGrupos(grupos))
    }

    const handleGrupoChange = (e: AutoCompleteChangeParams) => {
        const grupoSelecionado: Grupos = e.value
        formik.setFieldValue("idGrupoAnimal", grupoSelecionado)
        cS_grupo = grupoSelecionado.id
        console.log(grupoSelecionado)
    }

    const classificacaoService = useClassificacaoService()
    const [ listaClassificacoes, setListaClassificacoes ] = useState<Page<Classificacao>>({
        content: [],
        first: 0,
        number: 0,
        size: 0,
        totalElements: 0
    })

    const handleClassificacaoAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        classificacaoService
            .find_combo(nome, cS_grupo, 0, 20)
            .then(classificacao => setListaClassificacoes(classificacao))
    }

    const handleClassificacaoChange = (e: AutoCompleteChangeParams) => {
        const classificacaoSelecionada: Classificacao = e.value
        formik.setFieldValue("idClassificacaoAnimal", classificacaoSelecionada)
        cS_classificacao = classificacaoSelecionada.id
        console.log(classificacaoSelecionada)
    }

    const especieService = useEspecieService()
    const [ listaEspecies, setListaEspecies ] = useState<Page<Especie>>({
        content: [],
        first: 0,
        number: 0,
        size: 0,
        totalElements: 0
    })

    const handleEspecieAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        especieService
            .find(nome, cS_classificacao, 0, 20)
            .then(especie => setListaEspecies(especie))
    }

    const handleEspecieChange = (e: AutoCompleteChangeParams) => {
        const especieSelecionada: Especie = e.value
        formik.setFieldValue("idEspecieAnimal", especieSelecionada)
        console.log(especieSelecionada)
    }

    const [isLoading, setIsLoading] = useState(false)
    const [imageURL, setImageURL] = useState('')
    const pastaId: string | undefined = animais.id?.toString()
    const [numImg, setNumImg] = useState('')


    const img_prev = 'https://msikgermgspiwqsqxjas.supabase.co/storage/v1/object/public/Imagens/' + pastaId + '/'


    const clickAbrir = () => {

        window.open(formik.values.localizacao, '_blank')
        
    }

    const [session, loading] = useSession()
    const permissao = session?.user?.email?.substring(session?.user?.email?.length - 3, session?.user?.email?.length)
    

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
                    <Input id="data"
                        name="data"
                        label="Data do encontro com o animal: *"
                        autoComplete='off'
                        columnClasses='is-full'
                        value={formik.values.data?.toString()}
                        onChange={formik.handleChange}
                        error={formik.errors.data}
                        type='date'
                    />
                </div>

                <div className='p-field'>
                        <label htmlFor="grupo">Grupo: (não obrigatório)</label>
                        <AutoComplete
                            suggestions={listaGrupos.content}
                            completeMethod={handleGrupoAutoComplete}
                            value={formik.values.idGrupoAnimal}
                            field="nome"
                            id="idGrupoAnimal"
                            name="idGrupoAnimal"
                            onChange={handleGrupoChange}
                            />
                        <small className='p-error p-d-block'>
                            {formik.errors.idGrupoAnimal}
                        </small>
                </div>

                <div className='p-field'>
                    <label htmlFor="classificacao">Classificação: (não obrigatória)</label>
                        <AutoComplete
                            suggestions={listaClassificacoes.content}
                            completeMethod={handleClassificacaoAutoComplete}
                            value={formik.values.idClassificacaoAnimal}
                            field="nome"
                            id="idClassificacaoAnimal"
                            name="idClassificacaoAnimal"
                            onChange={handleClassificacaoChange}
                        />
                        <small className='p-error p-d-block'>
                            {formik.errors.idClassificacaoAnimal}
                        </small>
                </div>

                <div className='p-field'>
                    <label htmlFor="classificacao">Espécie: (não obrigatória)</label>
                        <AutoComplete
                            suggestions={listaEspecies.content}
                            completeMethod={handleEspecieAutoComplete}
                            value={formik.values.idEspecieAnimal}
                            field="nome"
                            id="idEspecieAnimal"
                            name="idEspecieAnimal"
                            onChange={handleEspecieChange}
                        />
                        <small className='p-error p-d-block'>
                            {formik.errors.idEspecieAnimal}
                        </small>
                </div>

                <div className='columns'>
                    <Input id="especie"
                        name="especie"
                        label="Informe a provável espécie do animal: *"
                        autoComplete='off'
                        columnClasses='is-full'
                        value={formik.values.especie}
                        onChange={formik.handleChange}
                        error={formik.errors.especie}
                        maxLength={70}
                    />
                </div>

                <br/>

                <div className='columns'>                    
                    <p>&nbsp;&nbsp;&nbsp;Acesse o&nbsp;
                    <a href='https://www.google.com/maps' target='_blank' >
                     Google maps
                    </a>
                    , copie a localização e cole neste campo. Não sabe como fazer,&nbsp;
                    <a href='https://www.youtube.com' target='_blank' >
                    assista a este vídeo.</a></p>
                </div>

                <div className="field is-grouped">
                    <p className="control is-expanded">
                        <input 
                            id='localizacao'
                            name='localizacao'
                            value={formik.values.localizacao}
                            onChange={formik.handleChange}
                            className="input"
                            type="text"
                            placeholder="Informe aqui a localização do Google Maps">
                            
                        </input>
                    </p>
                    <p className="control">                    
                        <button onClick={clickAbrir} className="button is-info">
                        Abrir a Localização
                        </button>                    
                    </p>
                </div>

                <br/>

                <div className='columns'>
                    <Input id="cadastradopor"
                        name="cadastradopor"
                        label="Cadastrado por (informe seu nome): *"
                        autoComplete='off'
                        columnClasses='is-full'
                        value={formik.values.cadastradopor}
                        onChange={formik.handleChange}
                        error={formik.errors.cadastradopor}
                        maxLength={50}
                    />
                </div>

                <div className='columns'>
                    <Input id="email"
                        name="email"
                        label="Informe seu e-mail para eventuais notificações: (não obrigatório)"
                        autoComplete='off'
                        columnClasses='is-full'
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        // error={formik.errors.email}
                        maxLength={70}
                    />
                </div>

                <div className='columns'>
                    <Input id="estado"
                        name="estado"
                        label="Estado do animal: *"
                        autoComplete='off'
                        columnClasses='is-full'
                        value={formik.values.estado}
                        onChange={formik.handleChange}
                        error={formik.errors.estado}
                        maxLength={70}
                    />
                </div>

                <div className='columns'>
                    <Input id="comentario"
                        name="comentario"
                        label="Comentários: (não obrigatório)"
                        autoComplete='off'
                        columnClasses='is-full'
                        value={formik.values.comentario}
                        onChange={formik.handleChange}
                        // error={formik.errors.comentario}
                    />
                </div>

                <div className='columns'>
                    <Input id="foto1"
                        name="foto1"
                        disabled
                        label="Foto 1: "
                        autoComplete='off'
                        columnClasses='is-full'
                        value={formik.values.foto1}
                        onChange={formik.handleChange}
                        error={formik.errors.foto1}
                        
                    />
                </div>

                <div className='columns'>
                    <Input id="foto2"
                        name="foto2"
                        disabled
                        label="Foto 2: "
                        autoComplete='off'
                        columnClasses='is-full'
                        value={formik.values.foto2}
                        onChange={formik.handleChange}
                        error={formik.errors.foto2}
                    />
                </div>

                <br/>
                
                {permissao==="adm" &&
                 
                <div className='columns'>
                    &nbsp;&nbsp;&nbsp;
                    <input 
                        id='confirmacao'
                        name='confirmacao'
                        checked={false}
                        //value={formik.values.confirmacao}
                        onChange={formik.handleChange}
                        //className="input"
                        type="checkbox">
                            
                    </input>
                    <label htmlFor="confirma">&nbsp;Registro Confirmado</label>
                </div>
                }

                <br/>
                <p>
                <b>*</b> = campos obrigatórios
                </p>
                <p>
                Ao salvar o registro, você não poderá excluí-lo, ele será validado pela Associação para que as informações se tornem públicas.
                </p>

                <div className='field is-grouped'>
                    <div className='control is-link'>
                        <button id='salvar' type='submit' className='button is-success'>
                            { formik.values.id ? "Atualizar" : "Salvar" }
                        </button>
                    </div>
                    
                    {permissao==="adm" &&
                    <div className='control is-link'>
                        <button type='button'
                                onClick={e => Router.push("/consultas/animais")}
                                className='button'>
                            Voltar
                        </button>
                    </div>
                    }
                </div>


                {/* <> */}
                    {/* <Toast /> */}
                    {/* <main className="bg-background w-full h-screen flex items-center justify-center"> */}
                        {/* <div className="w-full max-w-[420px] bg-white rounded-xl drop-shadow-md p-8"> */}
                        
                        <h1 className="has-text-centered has-text-grey">Fotos do Animal </h1>
                        <p className="has-text-centered has-text-grey">Salve as informações e depois envie as fotos (máximo duas).</p>
                        <br/>

                        {formik.values.id &&
                        <div style={{justifyContent:'center'}} className='columns'>
                            <div style={{display:'inline-block', float:'left', marginRight:'3%'}} >
                            {isLoading && numImg=='1' ? (
                                <UploadLoading numero='1' />
                            ) : (
                                <UploadImage
                                setNumImg={setNumImg}
                                setIsLoading={setIsLoading}
                                setImageURL={setImageURL}
                                pastaId={pastaId}
                                numImagem='1'
                                foto1={formik.values.foto1}
                                foto2=''
                                />
                            )}
                            </div>

                            {/* <br/> */}

                            <div style={{display:'inline-block', float:'left'}}>
                            {isLoading && numImg=='2' ? (
                                   <UploadLoading numero='2' />
                            ) : (
                                <UploadImage
                                setNumImg={setNumImg}
                                setIsLoading={setIsLoading}
                                setImageURL={setImageURL}
                                pastaId={pastaId}
                                numImagem='2'
                                foto1=''
                                foto2={formik.values.foto2}
                                />
                            )}
                            </div>

                         </div>
                        }

                         <br/>

                    {/* </main> */}
                {/* </> */}

            </div> 
        </form>

        
    )
}