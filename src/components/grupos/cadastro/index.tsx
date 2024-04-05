import { useEffect } from "react"
import { Layout } from "components"
import { useState } from "react"
import { GruposForm } from "./form"
import { useGrupoService } from "app/services/grupos.service"
import { Alert } from "components/common/message"
import { useRouter } from "next/router"
import { Grupos } from "app/models/grupos"

export const CadastroGrupo: React.FC = () => {

    const [grupo, setGrupo] = useState<Grupos>({})
    const [ messages, setMessages ] = useState<Array<Alert>>([])
    const service = useGrupoService()
    const router = useRouter()
    const { id } = router.query

    useEffect( () => {
        if(id){
            service.carregarGrupo(id)
                .then(grupoEncontrado => setGrupo(grupoEncontrado) )
        }
    }, [id] )

    const handleSubmit = (grupo: Grupos) => {
        
        if(grupo.id){
            service.atualizar(grupo).then(response => {
                setMessages([{
                    tipo: "success", texto: "Grupo atualizado com sucesso!"
                }])
            })
        } else {
            service.salvar(grupo)
                    .then(grupoSalvo => {
                        setGrupo(grupoSalvo)
                        setMessages([{
                            tipo: "success", texto: "Grupo salvo com sucesso!"
                        }])
                    })
        }
    }

    return (
        <Layout titulo="Grupos" mensagens={messages}>
            <GruposForm grupo={grupo} onSubmit={handleSubmit} />
        </Layout>
    )
}