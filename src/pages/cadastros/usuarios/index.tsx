import { CadastroUsuarios, RotaAutenticada } from 'components'
import { SessionProvider } from 'next-auth/react'

//export default CadastroUsuarios

export default () => (
    //<SessionProvider>
    <RotaAutenticada>
        <CadastroUsuarios />
    </RotaAutenticada>
    //</SessionProvider>
)