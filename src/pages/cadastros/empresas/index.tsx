import { CadastroEmpresa, RotaAutenticada} from "components"
import { SessionProvider } from "next-auth/react"

//export default CadastroEmpresa


export default () => (
    //<SessionProvider>
    <RotaAutenticada>
        <CadastroEmpresa />
    </RotaAutenticada>
    //</SessionProvider>
)