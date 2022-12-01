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

    let controle=0

    useEffect( () => {
        if(id){
            controle = 1
            console.log(controle)
            service.carregarPalpite(id)
                .then(palpiteEncontrado => setPalpites(palpiteEncontrado) )
        }
    }, [id] )

    const handleSubmit = (palpites: Palpites) => {

        console.log(controle)
        
        if(palpites.id){
            console.log(controle)
            service.atualizar(palpites).then(response => {
                if (response == "") {
                    //setPalpites()
                    setMessages([{
                        tipo: "success", texto: "Palpite atualizado com sucesso!"
                    }])
                }  
                if (response == "erro_data") {
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
    
    console.log(controle)

    if (controle==0){
        return (
            <Layout titulo="Palpites" mensagens={messages}>
                <PalpitesForm palpites={palpite} onSubmit={handleSubmit} />
            </Layout>
        )
    }else{
        return (
            <Layout titulo="Palpites">
                <PalpitesForm palpites={palpite} onSubmit={handleSubmit} />
            </Layout>
        )
    }
}