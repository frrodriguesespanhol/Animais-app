import { CadastroConfiguracao, RotaAutenticada } from 'components'
import { SessionProvider } from 'next-auth/react'

//export default CadastroConfiguracao

export default () => (
    //<SessionProvider>
    <RotaAutenticada>
        <CadastroConfiguracao />
    </RotaAutenticada>
    //</SessionProvider>
)