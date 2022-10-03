import { useEffect } from "react"
import { Layout } from "components"
import { useState } from "react"
import { EstadioForm } from "./form"
import { Estadio } from "app/models/estadios"
import { useEstadioService } from "app/services"
import { Alert } from "components/common/message"
import { useRouter } from "next/router"

export const CadastroEstadios: React.FC = () => {

    const [estadio, setEstadio] = useState<Estadio>({})
    const [ messages, setMessages ] = useState<Array<Alert>>([])
    const service = useEstadioService()
    const router = useRouter()
    const { id } = router.query

    useEffect( () => {
        if(id){
            service.carregarEstadio(id)
                .then(estadioEncontrado => setEstadio(estadioEncontrado) )
        }
    }, [id] )

    const handleSubmit = (estadio: Estadio) => {
        
        if(estadio.id){
            service.atualizar(estadio).then(response => {
                setMessages([{
                    tipo: "success", texto: "Estádio atualizado com sucesso!"
                }])
            })
        } else {
            service.salvar(estadio)
                    .then(estadioSalvo => {
                        setEstadio(estadioSalvo)
                        setMessages([{
                            tipo: "success", texto: "Estádio salvo com sucesso!"
                        }])
                    })
        }
    }

    return (
        <Layout titulo="Estádios" mensagens={messages}>
            <EstadioForm estadio={estadio} onSubmit={handleSubmit} />
        </Layout>
    )
}