import Link from "next/link"
import { signOut, useSession } from "next-auth/client"
import Image from 'next/image';

export const Menu: React.FC = () => {
    const [session, loading] = useSession()
    const permissao = session?.user?.email?.substring(session?.user?.email?.length - 3, session?.user?.email?.length)
    //const permissao = session?.user?.email

    return (
        
        <aside className="column is-2">
            
            {/* <p className="menu-label is-hidden-touch">
                Animais Silvestres
            </p> */}
            
            <Image
                src="/images/guara.jpg" // Substitua pelo caminho da imagem
                alt="Descrição da imagem" // Obrigatório para acessibilidade
                width={'200%'} // Largura da imagem
                height={'200%'} // Altura da imagem
                
            />
            


            <ul className="menu-list">
                {
                    (permissao==="adm" || permissao==="usu")  &&
                        <MenuItem href="/" label="Home" accesskey="0"/>
                }
                {
                    (permissao==="adm")  &&
                        <MenuItem href="/consultas/animais" label="Animais" accesskey="1" />
                }
                {
                    (permissao==="adm")  &&
                        <MenuItem href="/consultas/grupos" label="Grupos" accesskey="2" />
                }
                {
                    (permissao==="adm")  &&
                        <MenuItem href="/consultas/classificacoes" label="Classificações" accesskey="3" />
                }
                {
                    (permissao==="adm")  &&
                        <MenuItem href="/consultas/especies" label="Espécies" accesskey="4" />
                }
                {
                    (permissao==="adm")  &&
                        <MenuItem href="/consultas/paises" label="Países" accesskey="5" />
                }
                {
                    (permissao==="adm")  &&
                        <MenuItem href="/consultas/cidades" label="Cidades" accesskey="6" />
                }

                {
                    (permissao==="adm")  &&
                        <MenuItem href="/consultas/usuarios" label="Usuários" accesskey="7" />
                }
                {
                    (permissao==="adm" || permissao==="usu") &&
                        <MenuItem href="/acessibilidade" label="Acessibilidade" accesskey="8" />
                }
                                {
                    (permissao==="adm" || permissao==="usu") &&
                        <MenuItem href="https://mata-ciliar.vercel.app" target="_blank" label="Conteúdo Educativo" accesskey="8" />
                }
                {
                    (permissao==="adm" || permissao==="usu")  &&
                        <MenuItem onClick={() => signOut()} href="/" label="Sair" accesskey="9" />
                }
            </ul>

    
        </aside>
    )
}

interface MenuItemProps {
    href: string
    target?: string
    label: string
    accesskey: string
    onClick?: () => void
}

const MenuItem: React.FC<MenuItemProps> = (props: MenuItemProps) => {
    return (
        <li >
            <Link href={props.href}>
                <a onClick={props.onClick} target={props.target} accessKey={props.accesskey}>
                    <span className="icon"></span> { props.label }
                </a>
            </Link>
        </li>
    )
}