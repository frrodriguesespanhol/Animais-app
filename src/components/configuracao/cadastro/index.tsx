import { useEffect } from "react"
import { Layout } from "components"
import { useState } from "react"
import { Alert } from "components/common/message"
import { useRouter } from "next/router"
import { ConfiguracaoForm } from "./form"
import { useConfiguracaoService } from "app/services/configuracao.service"

export const CadastroConfiguracao: React.FC = () => {

    const [configuracao, setConfiguracao] = useState<Configuracao>({})
    const [ messages, setMessages ] = useState<Array<Alert>>([])
    const service = useConfiguracaoService()
    const router = useRouter()
    const { id } = router.query

    useEffect( () => {
        if(id){
            service.carregarConfiguracao(id)
                .then(configuracaoEncontrada => setConfiguracao(configuracaoEncontrada) )
        }
    }, [id] )

    const handleSubmit = (configuracao: Configuracao) => {
        
        if(configuracao.id){
            service.atualizar(configuracao).then(response => {
                setMessages([{
                    tipo: "success", texto: "Configuração atualizada com sucesso!"
                }])
            })
        } else {
            service.salvar(configuracao)
                    .then(configuracaoSalva => {
                        setConfiguracao(configuracaoSalva)
                        setMessages([{
                            tipo: "success", texto: "Configuração salva com sucesso!"
                        }])
                    })
        }
    }

    return (
        <Layout titulo="Configuracções" mensagens={messages}>
            <ConfiguracaoForm configuracao={configuracao} onSubmit={handleSubmit} />
        </Layout>
    )
}