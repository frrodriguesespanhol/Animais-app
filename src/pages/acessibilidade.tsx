import { Layout, ListagemAnimais, RotaAutenticada } from "components";
import { useSession } from 'next-auth/client'


export default () => {
    const [session] = useSession()
    const permissao = session?.user?.email?.substring(session?.user?.email.length-3, session?.user?.email.length)

return (
 
    <RotaAutenticada>
        {permissao==="adm" &&
        <Layout titulo="Acessibilidade">
            <h2>Acessibilidade</h2>
            <p>Este site foi projetado para ser acessível e usável.</p>
            <h2>Tamanho do Texto</h2>
            <p>É possível utilizar as seguintes combinações de teclas para usar o zoom no Microsoft Windows ou no Linux: </p>
            <ul>
              <li>Combinação da tecla CTRL e a tecla + (mais) para aumentar</li>
              <li>Combinação da tecla CTRL e a tecla - (menos) para diminuir</li>
              <li>Combinação da tecla CTRL e a tecla 0 (zero) para restaurar o tamanho original</li>
            </ul>
            <p>E no Mac OS: </p>
            <ul>
              <li>Combinação da tecla COMMAND e a tecla + (mais) para aumentar</li>
              <li>Combinação da tecla COMMAND e a tecla - (menos) para diminuir</li>
              <li>Combinação da tecla COMMAND e a tecla 0 (zero) para restaurar o tamanho original</li>
            </ul>
            <h2>Teclas de acesso</h2>
            <p>Teclas de acesso são um recurso de navegação que permitem você navegar neste site com o seu teclado, elas dependem do sistema operacional e do navegador que você usa. As combinações possíveis são:  </p>
            <ul>
              <li>tecla ALT para os navegadores Internet Explorer, Google Chrome e Safari em um computador Microsoft Windows</li>
              <li>teclas SHIFT e ALT, simultaneamente, para o navegador Mozilla Firefox em um computador Microsoft Windows ou Linux</li>
              <li>tecla COMMAND para o sistema operacional Mac OS</li>
            </ul>
            <p>Para acessar os itens abaixo, mantenha as teclas pressionadas mais o número abaixo escolhido:   </p>
            <ul>
              <li>0 — Home</li>
              <li>1 — Animais</li>
              <li>2 — Grupos</li>
              <li>3 — Classificações</li>
              <li>4 — Espécies</li>
              <li>5 — Países</li>
              <li>6 — Cidades</li>
              <li>7 — Usuários</li>
              <li>8 — Acessibilidade</li>
              <li>9 — Sair</li>
            </ul>
            <h2>Tradução automática de conteúdos de Língua Portuguesa para a Libras </h2>
            <p>O VLibras é uma suíte de ferramentas utilizadas na tradução automática do Português para a Língua Brasileira de Sinais. É possível utilizar essas ferramentas tanto no computador Desktop quanto em smartphones e tablets, através de extensões instaladas nos navegadores Google Chrome, Firefox, Safari; instalação nos sistemas operacionais Windows (7 ou superior), Addon VLibras NVDA, Linux (32 bits), Linux (64 bits); instalação em Android e IOS.   </p>

        </Layout>
        }
    </RotaAutenticada>
 
)
}