import { useEffect } from "react"
import { Layout } from "components"
import { useState } from "react"
import { ClassificacaoForm } from "./form"
import { useClassificacaoService } from "app/services/classificacao.service"
import { Alert } from "components/common/message"
import { useRouter } from "next/router"
import { Classificacao } from "app/models/classificacao"

export const CadastroClassificacao: React.FC = () => {

    const [classificacao, setClassificacao] = useState<Classificacao>({})
    const [ messages, setMessages ] = useState<Array<Alert>>([])
    const service = useClassificacaoService()
    const router = useRouter()
    const { id } = router.query

    useEffect( () => {
        if(id){
            service.carregarClassificacao(id)
                .then(classificacaoEncontrada => setClassificacao(classificacaoEncontrada) )
        }
    }, [id] )

    const handleSubmit = (classificacao: Classificacao) => {
        
        if(classificacao.id){
            service.atualizar(classificacao).then(response => {
                setMessages([{
                    tipo: "success", texto: "Classificação atualizada com sucesso!"
                }])
            })
        } else {
            service.salvar(classificacao)
                    .then(classificacaoSalva => {
                        setClassificacao(classificacaoSalva)
                        setMessages([{
                            tipo: "success", texto: "Classificação salva com sucesso!"
                        }])
                    })
        }
    }

    return (
        <Layout titulo="Classificações" mensagens={messages}>
            <ClassificacaoForm classificacao={classificacao} onSubmit={handleSubmit} />
        </Layout>
    )
}