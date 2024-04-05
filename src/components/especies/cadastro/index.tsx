import { useEffect } from "react"
import { Layout } from "components"
import { useState } from "react"
import { EspecieForm } from "./form"
import { useEspecieService } from "app/services/especie.service"
import { Alert } from "components/common/message"
import { useRouter } from "next/router"
import { Especie } from "app/models/especies"


export const CadastroEspecie: React.FC = () => {

    const [especie, setEspecie] = useState<Especie>({})
    const [ messages, setMessages ] = useState<Array<Alert>>([])
    const service = useEspecieService()
    const router = useRouter()
    const { id } = router.query

    useEffect( () => {
        if(id){
            service.carregarEspecie(id)
                .then(especieEncontrada => setEspecie(especieEncontrada) )
        }
    }, [id] )

    const handleSubmit = (especie: Especie) => {
        
        if(especie.id){
            service.atualizar(especie).then(response => {
                setMessages([{
                    tipo: "success", texto: "Espécie atualizada com sucesso!"
                }])
            })
        } else {
            service.salvar(especie)
                    .then(especieSalva => {
                        setEspecie(especieSalva)
                        setMessages([{
                            tipo: "success", texto: "Espécie salva com sucesso!"
                        }])
                    })
        }
    }

    return (
        <Layout titulo="Espécies" mensagens={messages}>
            <EspecieForm especie={especie} onSubmit={handleSubmit} />
        </Layout>
    )
}