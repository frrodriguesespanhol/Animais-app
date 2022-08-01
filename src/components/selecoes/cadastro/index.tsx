import { useEffect } from "react"
import { Layout } from "components"
import { useState } from "react"
import { SelecaoForm } from "./form"
import { useSelecaoService } from "app/services"
import { Alert } from "components/common/message"
import { useRouter } from "next/router"
import { Selecoes } from "app/models/selecoes"

export const CadastroSelecao: React.FC = () => {

    const [selecao, setSelecao] = useState<Selecoes>({})
    const [ messages, setMessages ] = useState<Array<Alert>>([])
    const service = useSelecaoService()
    const router = useRouter()
    const { id } = router.query

    useEffect( () => {
        if(id){
            service.carregarSelecao(id)
                .then(selecaoEncontrada => setSelecao(selecaoEncontrada) )
        }
    }, [id] )

    const handleSubmit = (selecao: Selecoes) => {
        
        if(selecao.id){
            service.atualizar(selecao).then(response => {
                setMessages([{
                    tipo: "success", texto: "Seleção atualizada com sucesso!"
                }])
            })
        } else {
            service.salvar(selecao)
                    .then(selecaoSalva => {
                        setSelecao(selecaoSalva)
                        setMessages([{
                            tipo: "success", texto: "Seleção salva com sucesso!"
                        }])
                    })
        }
    }

    return (
        <Layout titulo="Seleções" mensagens={messages}>
            <SelecaoForm selecao={selecao} onSubmit={handleSubmit} />
        </Layout>
    )
}