import { ListagemJogos, RotaAutenticada } from 'components'
import { SessionProvider } from 'next-auth/react'

//export default ListagemJogos

export default () => (
    //<SessionProvider>
    <RotaAutenticada>
        <ListagemJogos />
    </RotaAutenticada>
    //</SessionProvider>
) 