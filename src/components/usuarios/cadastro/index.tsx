import { useEffect } from "react"
import { Layout } from "components"
import { useState } from "react"
import { UsuarioForm } from "./form"
import { Usuario } from "app/models/usuarios"
import { useUsuarioService } from "app/services"
import { Alert } from "components/common/message"
import { useRouter } from "next/router"

export const CadastroUsuarios: React.FC = () => {

    const [usuario, setUsuario] = useState<Usuario>({})
    const [ messages, setMessages ] = useState<Array<Alert>>([])
    const service = useUsuarioService()
    const router = useRouter()
    const { id } = router.query

    useEffect( () => {
        if(id){
            service.carregarUsuario(id)
                .then(usuarioEncontrado => setUsuario(usuarioEncontrado) )
        }
    }, [id] )

    const handleSubmit = (usuario: Usuario) => {
        
        if(usuario.id){
            service.atualizar(usuario).then(response => {
                setMessages([{
                    tipo: "success", texto: "Usuário atualizado com sucesso!"
                }])
            })
        } else {
            service.salvar(usuario)
                    .then(usuarioSalvo => {
                        setUsuario(usuarioSalvo)
                        setMessages([{
                            tipo: "success", texto: "Usuário salvo com sucesso!"
                        }])
                    })
        }
    }

    return (
        <Layout titulo="Usuários" mensagens={messages}>
            <UsuarioForm usuario={usuario} onSubmit={handleSubmit} />
        </Layout>
    )
}