import Head from 'next/head'
import { Layout } from 'components'
import { RotaAutenticada } from 'components'
import { SessionProvider } from "next-auth/react"

const Home: React.FC = () => {
  return (
    //<SessionProvider>
    <RotaAutenticada >
      <Head>
        <title>Copa do Mundo 2022</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        
      <Layout />
    </RotaAutenticada>
    //</SessionProvider>
  )

}

export default Home