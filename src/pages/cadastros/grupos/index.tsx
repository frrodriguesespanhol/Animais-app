import { CadastroGrupo, RotaAutenticada } from 'components'
import { useSession } from 'next-auth/client'

export default () => {
    const [session] = useSession()
    const permissao = session?.user?.email?.substring(session?.user?.email.length-3, session?.user?.email.length)

return (

    <RotaAutenticada>
        {(permissao==="adm" || permissao==="usu") &&
            <CadastroGrupo />
        }
    </RotaAutenticada>

)
}