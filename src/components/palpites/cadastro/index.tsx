import { useEffect } from "react"
import { Layout } from "components"
import { useState } from "react"
import { Alert } from "components/common/message"
import { useRouter } from "next/router"
import { Palpites } from "app/models/palpites"
import { usePalpiteService } from "app/services/palpites.service"
import { PalpitesForm } from "./form"

export const CadastroPalpites: React.FC = () => {

    const [palpite, setPalpites] = useState<Palpites>({})
    const [ messages, setMessages ] = useState<Array<Alert>>([])
    const service = usePalpiteService()
    const router = useRouter()
    const { id } = router.query

    useEffect( () => {
        if(id){
            setMessages([{
                tipo: "primary", texto: "Este é o próximo jogo para palpitar!"
            }])
            service.carregarPalpite(id)
                .then(palpiteEncontrado => setPalpites(palpiteEncontrado) )
        }
    }, [id] )

    const handleSubmit = (palpites: Palpites) => {
        
        if(palpites.id){
            service.atualizar(palpites).then(response => {
                //console.log('atualizar')
                if (response == "".toString) {
                    setMessages([{
                        tipo: "success", texto: "Palpite atualizado com sucesso!"
                    }])
                }  
                if (response == "erro_data".toString) {
                    setMessages([{
                        tipo: "warning", texto: "O período de apostas para esse jogo já se encerrou!"
                    }])
                }

            })
        } else {            
            // service.salvar(jogos)   // apenas altera
            //         .then(jogoSalvo => {
            //             setJogos(jogoSalvo)
            //             setMessages([{
            //                 tipo: "success", texto: "Jogo salvo com sucesso!"
            //             }])
            //         })
        }
    }
    

        return (
            <Layout titulo="Palpites" mensagens={messages}>
                <PalpitesForm palpites={palpite} onSubmit={handleSubmit} />
            </Layout>
        )

}