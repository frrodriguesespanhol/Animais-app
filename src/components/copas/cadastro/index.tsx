import { useEffect } from "react"
import { Layout } from "components"
import { useState } from "react"
import { CopaForm } from "./form"
import { Copa } from "app/models/copas"
import { useCopaService } from "app/services"
import { Alert } from "components/common/message"
import { useRouter } from "next/router"

export const CadastroCopa: React.FC = () => {

    const [copa, setCopa] = useState<Copa>({})
    const [ messages, setMessages ] = useState<Array<Alert>>([])
    const service = useCopaService()
    const router = useRouter()
    const { id } = router.query

    useEffect( () => {
        if(id){
            service.carregarCopa(id)
                .then(copaEncontrada => setCopa(copaEncontrada) )
        }
    }, [id] )

    const handleSubmit = (copa: Copa) => {
        
        if(copa.id){
            service.atualizar(copa).then(response => {
                setMessages([{
                    tipo: "success", texto: "Copa atualizada com sucesso!"
                }])
            })
        } else {
            service.salvar(copa)
                    .then(copaSalva => {
                        setCopa(copaSalva)
                        setMessages([{
                            tipo: "success", texto: "Copa salva com sucesso!"
                        }])
                    })
        }
    }

    return (
        <Layout titulo="Copas" mensagens={messages}>
            <CopaForm copa={copa} onSubmit={handleSubmit} />
        </Layout>
    )
}