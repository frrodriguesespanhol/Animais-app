import { Equipes } from 'app/models/equipes'
import { Fases } from '../fases'
import { Estadio } from '../estadios'


export interface Jogos {
    id?: string
    eq1?: Equipes
    eq2?: Equipes
    gols1?: string
    gols2?: string
    estadio?: Estadio
    data_hora?: Date
    fase?: Fases
}