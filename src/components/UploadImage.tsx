import Image from 'next/image'

//import DefaultUploadImage from '@/assets/image.svg'
import { ChangeEvent, DragEvent, useState } from 'react'
// import { toast } from 'react-toastify'
import { createClient } from '@supabase/supabase-js'
import { options } from 'next-auth/client'
import { useAnimaisService } from 'app/services'
import { imageConfigDefault } from 'next/dist/server/image-config'
import { AnimaisForm } from './animais/cadastro/form'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

interface UploadImageProps {
  setIsLoading: (value: boolean) => void
  setImageURL: (value: string) => void
  setNumImg: (value: string) => void
  pastaId: string | undefined
  numImagem: string | undefined
}

let scr_imagem: string

//consultando a imagem 1 - isso não funcionou
// const img = supabase.storage
// .from('Imagens/10').getPublicUrl('1.png')

// console.log(img.data.publicUrl)


const chaveImagem = Date.now()

//talvez
//const service = useAnimaisService()


// let teste: number

export function UploadImage({ setImageURL, setIsLoading, pastaId, numImagem, setNumImg}: UploadImageProps) {
  const [isDragging, setIsDragging] = useState(false)

  
  // //const existeImagem = async function obterLista() {
  //   async function obterLista() {
  //        const { data, error } = await supabase
  //        .storage
  //        .from('Imagens')
  //        .list(pastaId, {
  //          limit: 100,
  //          offset: 0,
  //          sortBy: { column: 'name', order: 'asc' },
  //          search: numImagem
  //        })
  //        const numExiste: number = JSON.stringify(data).toString().search('name')
  //     teste=numExiste
  //   console.log('teste: ' +teste)
  //   //return numExiste
  // }
  
  console.log(pastaId)

  //obterLista()

  //console.log('teste aqui: ' +teste)
  //console.log('existe imagem: ' +existeImagem)

  //scr_imagem = 'https://msikgermgspiwqsqxjas.supabase.co/storage/v1/object/public/Imagens/' + pastaId + '/' + numImagem + '.' + 'png'
  // if (teste==-1) {
  //   console.log('passou teste ' + teste)
  //   scr_imagem = 'https://msikgermgspiwqsqxjas.supabase.co/storage/v1/object/public/Imagens/padrao.png'
  // }else{
  //   console.log('passou 2 teste ' + teste)
    scr_imagem = 'https://msikgermgspiwqsqxjas.supabase.co/storage/v1/object/public/Imagens/' + pastaId + '/' + numImagem
  //}
  
  console.log('endereço imagem:' + scr_imagem)

    
  function validateImage(file: File) {
    if (file.type.startsWith('image/')) return true
   // toast.error('Por favor selecione uma imagem válida!')
   alert('Por favor selecione uma imagem válida!')
    return false
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
  }

  async function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    const pasta_id = pastaId

    await handleSupabaseUpload(file, pasta_id)

  }

  async function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    const file = e.target.files?.[0]
    const pasta_id = pastaId

    file && (await handleSupabaseUpload(file, pasta_id))
  }

  async function handleSupabaseUpload(file: File, pasta_id: string | undefined) {
    console.log('número da imagem: ' + numImagem)
    setNumImg(numImagem + '')
    console.log('setNumImg' +'')
    console.log('aqui' + pasta_id)
    console.log('aqui tipo: ' + file.type.substring(6,12))



    if (file && validateImage(file)) {

      try {
        setIsLoading(true)
        const {data, error} = await supabase.storage
          .from('Imagens')
          //.upload(pasta_id + '/' + file.name, file, {
            //.upload(pasta_id + '/' + numImagem + '.' + file.type.substring(6,12), file, {
            .upload(pasta_id + '/' + numImagem , file, {
            upsert: true,
          })

        if (error) {
         // return toast.error('Ocorreu um erro durante a operação de envio da imagem!')
         alert('Por favor selecione uma imagem válida!')
         return false
        }

        //talvez atualizar as fotos no bd
        //service.atualizar()

        const { data: imageUrl } = supabase.storage
          .from('Imagens')
          .getPublicUrl(data.path)

        //const formData = new FormData()
        // formData.append('file', file)
        //formData.append('pasta_id', pasta_id)

        // const response = await fetch('/api/upload', {
        //   method: 'POST',
        //   body: formData,
        // })

        // const {imageUrl, error} = await response.json()

        // if (error) throw new Error(error)

        setImageURL(imageUrl.publicUrl)
        //setImageURL(imageUrl)

        //console.log(data)
      } catch (error) {
        console.error(error)
        if (error instanceof Error) {
          //toast.error(error.message)
          alert('Erro!')
          return false
        }
      } finally {
        setIsLoading(false)
        //console.log('passou')
      }
    }
  }


  return (
    <div className="box">
      {/* <h1 className="text-gray-500 text-xl">Anexe a imagem {numImagem}</h1> */}
      <h1 className="has-text-centered has-text-grey">Anexe a imagem {numImagem}</h1>
      <p className=" has-text-centered has-text-grey-light">Imagem pode ser Jpeg, Png,...</p>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        className={`column is-centered ${
          isDragging ? 'border-green' : 'border-light-blue'
        }  border-2 border-dashed rounded-xl p-10 flex items-center flex-col w-full justify-center gap-10`}>
        
        <div style={{display: 'flex', justifyContent: 'center', height:150}}>
          <img
            //src={DefaultUploadImage}
            //src='https://msikgermgspiwqsqxjas.supabase.co/storage/v1/object/public/Imagens/padrao.png'
            src={scr_imagem}       
            alt="Default image"
            //width={200}
            height={150}
            //priority
          />
        </div>
        <h3 className="has-text-centered has-text-grey">
          {' '}
          {!isDragging && 'Arraste e'} solte sua imagem aqui
        </h3>
      </div>

      <p className="has-text-centered has-text-grey">Ou</p>

      <div className="bg-primary hover:brightness-90 text-xs text-white rounded-lg">
        <label className="py-3 px-5 cursor-pointer block" htmlFor="fileInput">
          {/* Escolha uma imagem */}
        </label>
        <input onChange={handleFileInput} type="file" className="hidden" id="fileInput" />
      </div>
    </div>
  )
}
