import { ListagemCopas, RotaAutenticada } from "components";
import { SessionProvider } from "next-auth/react";

//export default ListagemCopas

export default () => (
    //<SessionProvider>
    <RotaAutenticada>
        <ListagemCopas />
    </RotaAutenticada>
    //</SessionProvider>
)