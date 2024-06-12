import Link from "next/link"
import { signOut, useSession } from "next-auth/client"

export const Menu: React.FC = () => {
    const [session, loading] = useSession()
    const permissao = session?.user?.email?.substring(session?.user?.email?.length - 3, session?.user?.email?.length)
    //const permissao = session?.user?.email

    return (

        <aside className="column is-2">
            {/* <p className="menu-label is-hidden-touch">
                Animais Silvestres
            </p> */}
            <ul className="menu-list">
                {
                    (permissao==="adm" || permissao==="usu")  &&
                        <MenuItem href="/" label="Home" />
                }
                {
                    (permissao==="adm")  &&
                        <MenuItem href="/consultas/animais" label="Animais" />
                }
                {
                    (permissao==="adm")  &&
                        <MenuItem href="/consultas/grupos" label="Grupos" />
                }
                {
                    (permissao==="adm")  &&
                        <MenuItem href="/consultas/classificacoes" label="Classificações" />
                }
                {
                    (permissao==="adm")  &&
                        <MenuItem href="/consultas/especies" label="Espécies" />
                }
                {
                    (permissao==="adm")  &&
                        <MenuItem href="/consultas/paises" label="Países" />
                }
                {
                    (permissao==="adm")  &&
                        <MenuItem href="/consultas/cidades" label="Cidades" />
                }

                {
                    (permissao==="adm")  &&
                        <MenuItem href="/consultas/usuarios" label="Usuários" />
                }
                {
                    (permissao==="adm" || permissao==="usu")  &&
                        <MenuItem onClick={() => signOut()} href="/" label="Sair" />
                }
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