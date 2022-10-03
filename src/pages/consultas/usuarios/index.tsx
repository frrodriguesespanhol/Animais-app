import { ListagemUsuarios, RotaAutenticada } from 'components'
import { SessionProvider } from 'next-auth/react'

export default () => (
    //<SessionProvider>
    <RotaAutenticada>
        <ListagemUsuarios />
    </RotaAutenticada>
    //</SessionProvider>
) 