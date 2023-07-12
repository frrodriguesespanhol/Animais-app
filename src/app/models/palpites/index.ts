import { Usuario } from '../usuarios'
import { Jogos } from '../jogos'

export interface Palpites {
    id?: string
    jogo?: Jogos
    data_hora?: string
    gols_equ1?: string
    gols_equ2?: string
    usuario?: Usuario
}