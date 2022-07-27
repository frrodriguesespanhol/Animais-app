import { useEffect } from "react"
import { Layout } from "components"
import { useState } from "react"
import { CidadeForm } from "./form"
import { Cidade } from "app/models/cidades"
import { useCidadeService } from "app/services"
import { Alert } from "components/common/message"
import { useRouter } from "next/router"

export const CadastroCidades: React.FC = () => {

    const [cidade, setCidade] = useState<Cidade>({})
    const [ messages, setMessages ] = useState<Array<Alert>>([])
    const service = useCidadeService()
    const router = useRouter()
    const { id } = router.query

    useEffect( () => {
        if(id){
            service.carregarCidade(id)
                .then(cidadeEncontrada => setCidade(cidadeEncontrada) )
        }
    }, [id] )

    const handleSubmit = (cidade: Cidade) => {
        
        if(cidade.id){
            service.atualizar(cidade).then(response => {
                setMessages([{
                    tipo: "success", texto: "Cidade atualizada com sucesso!"
                }])
            })
        } else {
            service.salvar(cidade)
                    .then(cidadeSalva => {
                        setCidade(cidadeSalva)
                        setMessages([{
                            tipo: "success", texto: "Cidade salva com sucesso!"
                        }])
                    })
        }
    }

    return (
        <Layout titulo="Cidades" mensagens={messages}>
            <CidadeForm cidade={cidade} onSubmit={handleSubmit} />
        </Layout>
    )
}