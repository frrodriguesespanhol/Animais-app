import { CadastroPalpites, RotaAutenticada } from 'components'
import { SessionProvider } from 'next-auth/react'

//export default CadastroPalpites

export default () => (
    //<SessionProvider>
    <RotaAutenticada>
        <CadastroPalpites />
    </RotaAutenticada>
    //</SessionProvider>
)