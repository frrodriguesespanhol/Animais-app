import { useEffect } from "react"
import { Layout } from "components"
import { useState } from "react"
import { EquipeForm } from "./form"
import { useEquipeService } from "app/services"
import { Alert } from "components/common/message"
import { useRouter } from "next/router"
import { Equipes } from "app/models/equipes"

export const CadastroEquipe: React.FC = () => {

    const [equipe, setEquipe] = useState<Equipes>({})
    const [ messages, setMessages ] = useState<Array<Alert>>([])
    const service = useEquipeService()
    const router = useRouter()
    const { id } = router.query

    useEffect( () => {
        if(id){
            service.carregarEquipe(id)
                .then(equipeEncontrada => setEquipe(equipeEncontrada) )
        }
    }, [id] )

    const handleSubmit = (equipe: Equipes) => {
        
        if(equipe.id){
            service.atualizar(equipe).then(response => {
                setMessages([{
                    tipo: "success", texto: "Equipe atualizada com sucesso!"
                }])
            })
        } else {
            service.salvar(equipe)
                    .then(equipeSalva => {
                        setEquipe(equipeSalva)
                        setMessages([{
                            tipo: "success", texto: "Equipe salva com sucesso!"
                        }])
                    })
        }
    }

    return (
        <Layout titulo="Equipes" mensagens={messages}>
            <EquipeForm equipe={equipe} onSubmit={handleSubmit} />
        </Layout>
    )
}