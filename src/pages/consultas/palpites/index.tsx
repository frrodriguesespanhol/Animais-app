import { ListagemPalpites, RotaAutenticada } from 'components'
import { SessionProvider } from 'next-auth/react'

//export default ListagemJogos

export default () => (
    //<SessionProvider>
    <RotaAutenticada>
        <ListagemPalpites />
    </RotaAutenticada>
    //</SessionProvider>
) 