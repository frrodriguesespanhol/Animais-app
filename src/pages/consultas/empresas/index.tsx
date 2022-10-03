import { ListagemEmpresas, RotaAutenticada } from "components";
import { SessionProvider } from "next-auth/react";

//export default ListagemEmpresas

export default () => (
    //<SessionProvider>
    <RotaAutenticada>
        <ListagemEmpresas />
    </RotaAutenticada>
    //</SessionProvider>
)