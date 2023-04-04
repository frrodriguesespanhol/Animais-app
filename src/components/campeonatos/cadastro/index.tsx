import { useEffect } from "react"
import { Layout } from "components"
import { useState } from "react"
import { CampeonatoForm } from "./form"
import { Campeonato } from "app/models/campeonatos"
import { useCampeonatoService } from "app/services"
import { Alert } from "components/common/message"
import { useRouter } from "next/router"

export const CadastroCampeonato: React.FC = () => {

    const [campeonato, setCampeonato] = useState<Campeonato>({})
    const [ messages, setMessages ] = useState<Array<Alert>>([])
    const service = useCampeonatoService()
    const router = useRouter()
    const { id } = router.query

    useEffect( () => {
        if(id){
            service.carregarCampeonato(id)
                .then(campeonatoEncontrada => setCampeonato(campeonatoEncontrada) )
        }
    }, [id] )

    const handleSubmit = (campeonato: Campeonato) => {
        
        if(campeonato.id){
            service.atualizar(campeonato).then(response => {
                setMessages([{
                    tipo: "success", texto: "Campeonato atualizada com sucesso!"
                }])
            })
        } else {
            service.salvar(campeonato)
                    .then(campeonatoSalva => {
                        setCampeonato(campeonatoSalva)
                        setMessages([{
                            tipo: "success", texto: "Campeonato salvo com sucesso!"
                        }])
                    })
        }
    }

    return (
        <Layout titulo="Campeonatos" mensagens={messages}>
            <CampeonatoForm campeonato={campeonato} onSubmit={handleSubmit} />
        </Layout>
    )
}