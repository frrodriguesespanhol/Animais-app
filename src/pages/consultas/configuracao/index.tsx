import { ListagemConfiguracao, RotaAutenticada } from 'components'
//import { SessionProvider } from 'next-auth/react'

//export default ListagemConfiguracao

export default () => (
    //<SessionProvider>
    <RotaAutenticada>
        <ListagemConfiguracao />
    </RotaAutenticada>
    //</SessionProvider>
) 