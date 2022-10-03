import { Cidade } from "app/models/cidades"

export interface Estadio {
    id?: string
    nome?: string
    idCidade?: Cidade
}
