import { Empresas } from '../empresas'
import { Campeonato } from '../campeonatos'

export interface Configuracao {
    id?: string
    empresa?: Empresas
    campeonato?: Campeonato
    pontos_cravada?: number
    pontos_acerto?: number
    pontos_erro?: number
}