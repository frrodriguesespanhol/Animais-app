import { CadastroEstadios, RotaAutenticada } from 'components'
import { SessionProvider } from 'next-auth/react'

//export default CadastroEstadios

export default () => (
    //<SessionProvider>
    <RotaAutenticada>
        <CadastroEstadios />
    </RotaAutenticada>
    //</SessionProvider>
)