import Head from 'next/head'
import { Layout } from 'components'
import { RotaAutenticada } from 'components'

function Home() {
  
  return (

    <RotaAutenticada >
      <Head>
        <title>Animais Silvestres</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout titulo="Home">

      </Layout >
    </RotaAutenticada>

  )
}

export default Home