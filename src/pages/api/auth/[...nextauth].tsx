import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import { Usuario } from "app/models/usuarios"
import { AxiosResponse } from "axios"
import { httpClient } from "app/http";

const resourceURL: string = "api/usuarios/validarSenha"

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: "Bolão Campeonato Brasileiro",

      credentials: {
        email: { label: "Usuário", type: "text ", placeholder: "" },
        senha: { label: "Senha", type: "password" },
      },

      async authorize(credentials, req) {
        //const user = { id: 1, name: "J Smith", email: "jsmith@example.com", empresa: "Teste-Empresa"}
        const url = `${resourceURL}?email=${credentials?.email}&senha=${credentials?.senha}`
        const user:  AxiosResponse = await httpClient.get(url)
        //const user:  AxiosResponse<Usuario> = await httpClient.get(url)

        //return user.data
          
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          
          //console.log(user.data.tipo)

          return user.data

        } else {
          console.log(" não passou")
           // If you return null then an error will be displayed advising the user to check their details.
          return null
           // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      
      }
    
    })
    
  ]
  
})