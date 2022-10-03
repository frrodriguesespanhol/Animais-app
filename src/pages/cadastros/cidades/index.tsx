import { CadastroCidades, RotaAutenticada } from 'components'
import { SessionProvider } from 'next-auth/react'

// export default CadastroCidades

export default () => (
    //<SessionProvider>
    <RotaAutenticada>
        <CadastroCidades />
    </RotaAutenticada>
    //</SessionProvider>
)