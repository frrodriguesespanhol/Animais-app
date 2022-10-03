import { ListagemSelecoes, RotaAutenticada } from "components";
import { SessionProvider } from "next-auth/react";

//export default ListagemSelecoes

export default () => (
    //<SessionProvider>
    <RotaAutenticada>
        <ListagemSelecoes />
    </RotaAutenticada>
    //</SessionProvider>
) 

