import { Classificacao } from "../classificacao"
import { Especie } from "../especies"
import { Grupos } from "../grupos"

export interface Animais {
    id?: string
    data?: Date
    idGrupoAnimal?: Grupos
    idClassificacaoAnimal?: Classificacao
    idEspecieAnimal?: Especie
    especie?: string
    localizacao?: string
    cadastradopor?: string
    email?: string
    estado?: string
    comentario?: string
    foto1?: string
    foto2?: string
}