import { Paises } from "app/models/paises"

export interface Cidade {
    id?: string
    nome?: string
    idPais?: Paises
}
