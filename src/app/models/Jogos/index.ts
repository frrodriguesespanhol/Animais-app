import { Selecoes } from 'app/models/selecoes'
import { Cidade } from "app/models/cidades"


export interface Jogos {
    id?: string
    sel1?: Selecoes
    sel2?: Selecoes
    gols1?: string
    gols2?: string
    cidade?: Cidade
    data_hora?: string
    fase?: string
}