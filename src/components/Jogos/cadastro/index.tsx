import { useEffect } from "react"
import { Layout } from "components"
import { useState } from "react"
import { Alert } from "components/common/message"
import { useRouter } from "next/router"
import { Jogos } from "app/models/jogos"
import { useJogoService } from "app/services/jogos.service"
import { JogosForm } from './form'

export const CadastroJogos: React.FC = () => {

    const [jogo, setJogos] = useState<Jogos>({})
    const [ messages, setMessages ] = useState<Array<Alert>>([])
    const service = useJogoService()
    const router = useRouter()
    const { id } = router.query

    useEffect( () => {
        if(id){
            service.carregarJogo(id)
                .then(jogoEncontrado => setJogos(jogoEncontrado) )
        }
    }, [id] )

    const handleSubmit = (jogos: Jogos) => {
        
        if(jogos.id){
            service.atualizar(jogos).then(response => {
                setMessages([{
                    tipo: "success", texto: "Jogo atualizado com sucesso!"
                }])
            })
        } else {
            service.salvar(jogos)
                    .then(jogoSalvo => {
                        setJogos(jogoSalvo)
                        setMessages([{
                            tipo: "success", texto: "Jogo salvo com sucesso!"
                        }])
                    })
        }
    }

    return (
        <Layout titulo="Jogos" mensagens={messages}>
            <JogosForm jogos={jogo} onSubmit={handleSubmit} />
        </Layout>
    )
}