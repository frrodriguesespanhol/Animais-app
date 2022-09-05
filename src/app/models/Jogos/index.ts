import { Selecoes } from 'app/models/selecoes'
import { Cidade } from "app/models/cidades"
import { Fases } from '../fases'


export interface Jogos {
    id?: string
    sel1?: Selecoes
    sel2?: Selecoes
    gols1?: string
    gols2?: string
    cidade?: Cidade
    data_hora?: Date
    fase?: Fases
}