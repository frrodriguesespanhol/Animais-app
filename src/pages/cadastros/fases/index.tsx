import { CadastroFase, RotaAutenticada } from "components"
import { SessionProvider } from "next-auth/react"

//export default CadastroFase

export default () => (
    //<SessionProvider>
    <RotaAutenticada>
        <CadastroFase />
    </RotaAutenticada>
    //</SessionProvider>
)