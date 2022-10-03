import { Empresas } from '../empresas'
import { Copa } from '../copas'

export interface Configuracao {
    id?: string
    empresa?: Empresas
    copa?: Copa
    pontos_cravada?: number
    pontos_acerto?: number
    pontos_erro?: number
}