import Link from "next/link"
import { signOut } from "next-auth/client"

export const Menu: React.FC = () => {
    return (
        <aside className="column is-2 is-narrow-mobile is-fullheight is-hidden-mobile">
            <p className="menu-label is-hidden-touch">
                Copa do Mundo
            </p>
            <ul className="menu-list">
                <MenuItem href="/" label="Home" />
                <MenuItem href="/consultas/configuracao" label="Configuração" />
                <MenuItem href="/consultas/copas" label="Copas" />
                <MenuItem href="/consultas/cidades" label="Cidades" />
                <MenuItem href="/consultas/estadios" label="Estádios" />
                <MenuItem href="/consultas/selecoes" label="Seleções" />
                <MenuItem href="/consultas/jogos" label="Jogos" />
                <MenuItem href="/consultas/fases" label="Fases" />
                <MenuItem href="/consultas/empresas" label="Empresas" />
                <MenuItem href="/consultas/usuarios" label="Usuários" />
                <MenuItem href="/consultas/palpites" label="Palpites" />
                <MenuItem onClick={() => signOut()} href="/" label="Sair" />
            </ul>
        </aside>
    )
}

interface MenuItemProps {
    href: string
    label: string
    onClick?: () => void
}

const MenuItem: React.FC<MenuItemProps> = (props: MenuItemProps) => {
    return (
        <li>
            <Link href={props.href}>
                <a onClick={props.onClick}>
                    <span className="icon"></span> { props.label }
                </a>
            </Link>
        </li>
    )
}