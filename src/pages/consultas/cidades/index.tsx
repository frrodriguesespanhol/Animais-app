import { ListagemCidades, RotaAutenticada } from 'components'
import { SessionProvider } from 'next-auth/react'

//export default ListagemCidades

export default () => (
    //<SessionProvider>
    <RotaAutenticada>
        <ListagemCidades />
    </RotaAutenticada>
    //</SessionProvider>
)