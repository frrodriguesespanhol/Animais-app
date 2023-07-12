import { Equipes } from '../equipes'
import { Fases } from '../fases'
import { Estadio } from '../estadios'


export interface Jogos {
    id?: string
    equ1?: Equipes
    equ2?: Equipes
    gols1?: string
    gols2?: string
    estadio?: Estadio
    data_hora?: Date
    fase?: Fases
}