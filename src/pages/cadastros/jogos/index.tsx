import { CadastroJogos, RotaAutenticada } from 'components'
import { SessionProvider } from 'next-auth/react'

//export default CadastroJogos

export default () => (
    //<SessionProvider>
    <RotaAutenticada>
        <CadastroJogos />
    </RotaAutenticada>
    //</SessionProvider>
)