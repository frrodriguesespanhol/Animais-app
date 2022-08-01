import Link from "next/link"

export const Menu: React.FC = () => {
    return (
        <aside className="column is-2 is-narrow-mobile is-fullheight is-hidden-mobile">
            <p className="menu-label is-hidden-touch">
                Minhas Vendas
            </p>
            <ul className="menu-list">
                <MenuItem href="/" label="Home" />
                <MenuItem href="/consultas/copas" label="Copas" />
                <MenuItem href="/consultas/cidades" label="Cidades" />
                <MenuItem href="/consultas/selecoes" label="Seleções" />
                <MenuItem href="/" label="Sair" />
            </ul>
        </aside>
    )
}

interface MenuItemProps {
    href: string
    label: string
}

const MenuItem: React.FC<MenuItemProps> = (props: MenuItemProps) => {
    return (
        <li>
            <Link href={props.href}>
                <a>
                    <span className="icon"></span> { props.label }
                </a>
            </Link>
        </li>
    )
}