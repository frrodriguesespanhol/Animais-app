import { Usuario } from '../usuarios'
import { Jogos } from '../jogos'

export interface Palpites {
    id?: string
    jogo?: Jogos
    data_hora?: string
    gols_sel1?: string
    gols_sel2?: string
    usuario?: Usuario
}