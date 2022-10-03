import { ListagemFases, RotaAutenticada } from "components";
import { SessionProvider } from "next-auth/react";

//export default ListagemFases

export default () => (
    //<SessionProvider>
    <RotaAutenticada>
        <ListagemFases />
    </RotaAutenticada>
    //</SessionProvider>
)