import { CadastroCopa, RotaAutenticada } from "components"
import { SessionProvider } from "next-auth/react"

//export default CadastroCopa

export default () => (
    //<SessionProvider>
    <RotaAutenticada>
        <CadastroCopa />
    </RotaAutenticada>
    //</SessionProvider>
)