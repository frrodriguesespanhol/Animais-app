import { ListagemEstadios, RotaAutenticada } from 'components'
import { SessionProvider } from 'next-auth/react'

//export default ListagemEstadios

export default () => (
    //<SessionProvider>
    <RotaAutenticada>
        <ListagemEstadios />
    </RotaAutenticada>
    //</SessionProvider>
)