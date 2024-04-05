import { useEffect } from "react"
import { Layout } from "components"
import { useState } from "react"
import { AnimaisForm } from "./form"
import { Animais } from "app/models/animais"
import { useAnimaisService } from "app/services"
import { Alert } from "components/common/message"
import { useRouter } from "next/router"

export const CadastroAnimais: React.FC = () => {

    const [animal, setAnimal] = useState<Animais>({})
    const [ messages, setMessages ] = useState<Array<Alert>>([])
    const service = useAnimaisService()
    const router = useRouter()
    const { id } = router.query

    useEffect( () => {
        if(id){
            service.carregarAnimal(id)
                .then(animalEncontrado => setAnimal(animalEncontrado) )
        }
    }, [id] )

    const handleSubmit = (animal: Animais) => {
        
        if(animal.id){
            service.atualizar(animal).then(response => {
                setMessages([{
                    tipo: "success", texto: "Animal atualizado com sucesso!"
                }])
            })
        } else {
            service.salvar(animal)
                    .then(animalSalvo => {
                        setAnimal(animalSalvo)
                        setMessages([{
                            tipo: "success", texto: "Animal salvo com sucesso!"
                        }])
                    })
        }
    }

    return (
        <Layout titulo="Animais" mensagens={messages}>
            <AnimaisForm animais={animal} onSubmit={handleSubmit} />
        </Layout>
    )
}