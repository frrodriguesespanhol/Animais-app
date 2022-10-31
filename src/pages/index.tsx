import Head from 'next/head'
import { Layout } from 'components'
import { RotaAutenticada } from 'components'
import { usePalpiteService } from 'app/services/palpites.service'
import { Palpites } from 'app/models/palpites'
import { useState } from 'react'
import { Button } from '@mui/material'
import { DataTable, DataTablePageParams } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Page } from 'app/models/common/page'
import { useFormik } from 'formik'

export interface Ranking {
  nome?: string
  pontuacao?: number,
  cravadas?: number,
  onSubmit?: () => void
}

const formScheme: Ranking = {
  nome: '',
  pontuacao: undefined,
  cravadas: undefined
}

export const Home: React.FC<Ranking> = ({
  nome,
  pontuacao,
  cravadas,
  onSubmit
}) => {

  const palpiteService = usePalpiteService()
  const [ loading, setLoading ] = useState<boolean>(false)
  const [ palpites, setPalpites ] = useState<Page<Ranking>>({
    content: [],
    first: 0,
    number: 0,
    size: 0,
    totalElements: 0
})


const handleSubmit = (filtro: Ranking) => {
  handlePage(null)
}

const {
  handleSubmit: formikSubmit,
  values: filtro,
  handleChange
} = useFormik<Ranking>({
  onSubmit: handleSubmit,
  initialValues: { nome: '' , pontuacao: 0, cravadas: 0  }
})



const handlePage = (event: DataTablePageParams | any) => {
setLoading(true)
palpiteService.ranking(event?.page, event?.rows)
                .then(result => {
                    setPalpites({...result, first: event?.first})
                }).finally(() => setLoading(false))
  
                console.log(palpites.content)
              }

const actionTemplate = () => {
  const url = `/palpites/ranking`
  return (
      <div>
        {/* {palpites.content}  */}
      </div>
  )
}


const formik = useFormik<Ranking>({
  initialValues: {...formScheme},
  onSubmit(values, formikHelpers) {
    
  },
  enableReinitialize: true
  //validationSchema: validationScheme
})


  return (

    <RotaAutenticada >
      <Head>
        <title>Copa do Mundo 2022</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout titulo="Home">
      <form onSubmit={formikSubmit}>
        <h2>
          Regras Gerais
        </h2>
        <ul>
          <li>A aposta do jogo será aceita até 20 minutos antes de seu início;</li>
          <li>O apostador que cravar o resultado do jogo, fará 4 pontos;</li>
          <li>O apostador que acertar pelo vencedor do jogo ou pelo empate, fará 2 pontos;</li>
          <li>O apostador que errar o resultado do jogo, não pontuará;</li>
          <li>Todos os dias de jogos o ranking geral será atualizado com a soma das pontuações;</li>
          <li>Ao final da copa, o primeiro colocado ganhará 50% do valor arrecadado;</li>
          <li>O segundo colocado ganhará 30% do valor arrecadado;</li>
          <li>O terceiro colocado ganhará 20% do valor arrecadado;</li>
          <li>Em caso de empates, não haverá desempate;</li>
          <li>Dessa forma, o valor será dividido igualmente entre ambos;</li>
          <li>Ex.: se houver 3 apostadores empatados na segunda posição do ranking, 
              cada um levará 10% do valor arrecadado, pois 30% / 3 = 10%;</li>
          <li>Não haverá prêmio de consolação para o último colocado;</li>
          <li>Para palpitar, acesse o menu Palpites, escolha a data de um jogo (se desejar), 
              escolha seu nome em Usuário e Consulte, depois clique no botão Palpitar 
              na frente das informações do jogo, daí basta informar o palpite para 
              o jogo e salvar;
          </li>
          <li>Para visualizar os palpites dos concorrentes, entre em Palpites, 
              selecione a data de um jogo (se desejar), escolha um outro Usuário Apostador 
              e Consulte suas apostas.
          </li>
        </ul>
        <h2>
          Ranking Geral
        </h2>
        <div className='columns'>
        <Button type='submit' className='button is-success'>Visualizar Ranking</Button>
        </div>
        <div className='columns'>
                <div className='is-full'>
                    <DataTable value={palpites.content}
                            lazy paginator
                            totalRecords={palpites.totalElements}
                            first={palpites.first}
                            rows={palpites.size}
                            onPage={handlePage}
                            loading={loading}
                            emptyMessage="Nenhum registro."
                            >
                        <Column field="nome" header="Apostador" />
                        <Column field='pontuacao' header="Pontuação" />
                        <Column field='cravadas' header="Cravadas" />
                        <Column body={actionTemplate} />
                    </DataTable>

                </div>

            </div>
      </form>
      </Layout >
    </RotaAutenticada>

  )

}

export default Home