import { useEffect } from "react"
import { Layout } from "components"
import { useState } from "react"
import { PaisesForm } from "./form"
import { usePaisesService } from "app/services/paises.service"
import { Alert } from "components/common/message"
import { useRouter } from "next/router"
import { Paises } from "app/models/paises"

export const CadastroPaises: React.FC = () => {

    const [paises, setPaises] = useState<Paises>({})
    const [ messages, setMessages ] = useState<Array<Alert>>([])
    const service = usePaisesService()
    const router = useRouter()
    const { id } = router.query

    useEffect( () => {
        if(id){
            service.carregarPais(id)
                .then(paisEncontrado => setPaises(paisEncontrado) )
        }
    }, [id] )

    const handleSubmit = (paises: Paises) => {
        
        if(paises.id){
            service.atualizar(paises).then(response => {
                setMessages([{
                    tipo: "success", texto: "País atualizado com sucesso!"
                }])
            })
        } else {
            service.salvar(paises)
                    .then(paisSalvo => {
                        setPaises(paisSalvo)
                        setMessages([{
                            tipo: "success", texto: "País salvo com sucesso!"
                        }])
                    })
        }
    }

    return (
        <Layout titulo="Países" mensagens={messages}>
            <PaisesForm paises={paises} onSubmit={handleSubmit} />
        </Layout>
    )
}