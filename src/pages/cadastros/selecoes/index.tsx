import { CadastroSelecao, RotaAutenticada } from "components"
import { SessionProvider } from "next-auth/react"

//export default CadastroSelecao

export default () => (
    //<SessionProvider>
    <RotaAutenticada>
        <CadastroSelecao />
    </RotaAutenticada>
    //</SessionProvider>
)