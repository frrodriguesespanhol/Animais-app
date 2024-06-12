import Image from 'next/image'

//import DefaultUploadImage from '@/assets/image.svg'
import { ChangeEvent, DragEvent, useState } from 'react'
// import { toast } from 'react-toastify'
import { createClient } from '@supabase/supabase-js'
import { options } from 'next-auth/client'
import { useAnimaisService } from 'app/services'
import { imageConfigDefault } from 'next/dist/server/image-config'
import { AnimaisForm } from './animais/cadastro/form'
import { randomBytes, randomFillSync } from 'crypto'

const service = useAnimaisService()

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
  foto1: string | undefined
  foto2: string | undefined
}

let scr_imagem: string
let chaveImagem = Date.now()

export function UploadImage({ setImageURL, setIsLoading, pastaId, numImagem,
                              setNumImg, foto1, foto2}: UploadImageProps) {
  const [isDragging, setIsDragging] = useState(false)
  
  scr_imagem = foto1 + '' || foto2 +''
  const scr_imagem_padrao: string | undefined = 'https://msikgermgspiwqsqxjas.supabase.co/storage/v1/object/public/Imagens/padrao.png'
       
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
    setNumImg(numImagem + '')
    
    if (file && validateImage(file)) {

      chaveImagem = Date.now()
      try {
        setIsLoading(true)
        const {data, error} = await supabase.storage
          .from('Imagens')
            .upload(pasta_id + '/' + numImagem + '/' + pasta_id + '_' + numImagem + '_' + chaveImagem , file, {
            upsert: true,
          })

        if (error) {
         // return toast.error('Ocorreu um erro durante a operação de envio da imagem!')
         alert('Por favor selecione uma imagem válida!')
         return false
        }

        const { data: imageUrl } = supabase.storage
          .from('Imagens')
          .getPublicUrl(data.path)
           
        //if (foto1!='null') { //rever isso
        if (numImagem=='1') {
          service.atualizarFoto(imageUrl.publicUrl, pastaId, 'foto1')
        }else {
          service.atualizarFoto(imageUrl.publicUrl, pastaId, 'foto2')
        }

        
        setImageURL(imageUrl.publicUrl)
        localStorage.setItem("foto_" + pasta_id + '_' + numImagem,imageUrl.publicUrl)
        //console.log("Chave imagem: "+ chaveImagem)

      } catch (error) {
        console.error(error)
        if (error instanceof Error) {
          //toast.error(error.message)
          alert('Erro!')
          return false
        }
      } finally {
        setIsLoading(false)
      }
    }

  }

  console.log('Local Storage: ' + localStorage.getItem("foto_" + pastaId + '_' + numImagem))
  console.log('scr_imagem: ' + scr_imagem)
  console.log('scr_imagem_padrao: ' + scr_imagem_padrao)
  let imgFinal: string | undefined

  if (localStorage.getItem("foto_" + pastaId + '_' + numImagem)!='null')
    imgFinal=localStorage.getItem("foto_" + pastaId + '_' + numImagem) + ''
  if (scr_imagem!='null' && imgFinal=='null')
    imgFinal=scr_imagem + ''
  if ((scr_imagem=='null' || scr_imagem=='') && (imgFinal=='null' ||imgFinal==''))
    imgFinal=scr_imagem_padrao + ''

  console.log('imgFinal: ' + imgFinal)

  return (
    <div className="box">
      {/* <h1 className="text-gray-500 text-xl">Anexe a imagem {numImagem}</h1> */}
      <h1 className="has-text-centered has-text-grey">Anexe a foto {numImagem}</h1>
      <p className=" has-text-centered has-text-grey-light">Imagem pode ser Jpeg, Png,...</p>
      <p className=" has-text-centered has-text-grey-light">Clique sobre a imagem para ampliá-la</p>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        className={`column is-centered ${
          isDragging ? 'border-green' : 'border-light-blue'
        }  border-2 border-dashed rounded-xl p-10 flex items-center flex-col w-full justify-center gap-10`}>
        
        <a href={imgFinal} target='_blank'>
        <div style={{display: 'flex', justifyContent: 'center', height:150}}>
          <img            
            // src={localStorage.getItem("foto_" + pastaId + '_' + numImagem) || scr_imagem || scr_imagem_padrao}  
            src={imgFinal}
            alt="Default image"            
            height={150}  
            
          />
        </div>
        </a>
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
