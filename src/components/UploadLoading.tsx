interface UploadLoadingProps {
  numero: string
}


export function UploadLoading({numero}: UploadLoadingProps) {
  return (
    <>
    <div className="box">  
      <h3 className="has-text-centered has-text-grey">Subindo a Imagem {numero}...</h3>
    </div>

    </>
  )
}