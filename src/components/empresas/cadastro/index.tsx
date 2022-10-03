import { useEffect } from "react"
import { Layout } from "components"
import { useState } from "react"
import { EmpresaForm } from "./form"
import { useEmpresaService } from "app/services/empresas.service"
import { Alert } from "components/common/message"
import { useRouter } from "next/router"
import { Empresas } from "app/models/empresas"


export const CadastroEmpresa: React.FC = () => {

    const [empresa, setEmpresa] = useState<Empresas>({})
    const [ messages, setMessages ] = useState<Array<Alert>>([])
    const service = useEmpresaService()
    const router = useRouter()
    const { id } = router.query

    useEffect( () => {
        if(id){
            service.carregarEmpresa(id)
                .then(empresaEncontrada => setEmpresa(empresaEncontrada) )
        }
    }, [id] )

    const handleSubmit = (empresa: Empresas) => {
        
        if(empresa.id){
            service.atualizar(empresa).then(response => {
                setMessages([{
                    tipo: "success", texto: "Empresa atualizada com sucesso!"
                }])
            })
        } else {
            service.salvar(empresa)
                    .then(empresaSalva => {
                        setEmpresa(empresaSalva)
                        setMessages([{
                            tipo: "success", texto: "Empresa salva com sucesso!"
                        }])
                    })
        }
    }

    return (
        <Layout titulo="Empresas" mensagens={messages}>
            <EmpresaForm empresa={empresa} onSubmit={handleSubmit} />
        </Layout>
    )
}