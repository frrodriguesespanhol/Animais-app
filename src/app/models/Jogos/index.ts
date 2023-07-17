import { Equipes } from '../equipes'
import { Fases } from '../fases'
import { Estadio } from '../estadios'
import { Campeonato } from '../campeonatos'


export interface Jogos {
    id?: string
    equ1?: Equipes
    equ2?: Equipes
    gols1?: string
    gols2?: string
    estadio?: Estadio
    data_hora?: Date
    fase?: Fases
    campeonato?: Campeonato
}