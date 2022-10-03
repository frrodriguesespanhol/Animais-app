import { Selecoes } from 'app/models/selecoes'
import { Fases } from '../fases'
import { Estadio } from '../estadios'


export interface Jogos {
    id?: string
    sel1?: Selecoes
    sel2?: Selecoes
    gols1?: string
    gols2?: string
    estadio?: Estadio
    data_hora?: Date
    fase?: Fases
}