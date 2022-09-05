import { useEffect } from "react"
import { Layout } from "components"
import { useState } from "react"
import { FaseForm } from "./form"
import { useFaseService } from "app/services/fases.service"
import { Alert } from "components/common/message"
import { useRouter } from "next/router"
import { Fases } from "app/models/fases"


export const CadastroFase: React.FC = () => {

    const [fase, setFase] = useState<Fases>({})
    const [ messages, setMessages ] = useState<Array<Alert>>([])
    const service = useFaseService()
    const router = useRouter()
    const { id } = router.query

    useEffect( () => {
        if(id){
            service.carregarFase(id)
                .then(faseEncontrada => setFase(faseEncontrada) )
        }
    }, [id] )

    const handleSubmit = (fase: Fases) => {
        
        if(fase.id){
            service.atualizar(fase).then(response => {
                setMessages([{
                    tipo: "success", texto: "Fase atualizada com sucesso!"
                }])
            })
        } else {
            service.salvar(fase)
                    .then(faseSalva => {
                        setFase(faseSalva)
                        setMessages([{
                            tipo: "success", texto: "Fase salva com sucesso!"
                        }])
                    })
        }
    }

    return (
        <Layout titulo="Fases" mensagens={messages}>
            <FaseForm fase={fase} onSubmit={handleSubmit} />
        </Layout>
    )
}