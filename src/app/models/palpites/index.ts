import { Usuario } from '../usuarios'
import { Jogos } from '../jogos'

export interface Palpites {
    id?: string
    jogo?: Jogos
    data_hora?: string
    gols_eq1?: string
    gols_eq2?: string
    usuario?: Usuario
}