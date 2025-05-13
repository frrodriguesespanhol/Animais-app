import Image from 'next/image'
import { MdCheckCircle } from 'react-icons/md'
import example from '../assets/image-demo.jpg'

interface ImagePreviewProps {
  imageUrl: string
}

export function ImagePreview({imageUrl}: ImagePreviewProps) {

  function copyLinkToClipboard() {
    navigator.clipboard.writeText(imageUrl)
  //  toast.info('Sua imagem foi copiada para o Clipboard')
  }

  //console.log(imageUrl + 'teste')

  return (
     <div className="box">
       {/* <MdCheckCircle size={43} className="text-green" /> */}

       {/* <img src={imageUrl} /> */}
       <Image
         src={imageUrl}
         //src={example}
         className="rounded-xl"
         alt="Image Description"
         width={200}
         height={150}
         loading='lazy'
         //fetchPriority='high'
       />

       <div className="rounded-lg border-2 border-gray-200 w-full flex mt-4 items-center bg-gray-50">
         <div className="text-gray-500 px-3 text-xs overflow-hidden whitespace-nowrap text-ellipsis max-w-[80%]">
           {imageUrl}
         </div>
         <button onClick={copyLinkToClipboard} className="bg-primary hover:brightness-90 w-full m-[1px] py-3 text-xs text-white rounded-lg">
           Copiar Link
         </button>
       </div>
     </div>
  )
}
