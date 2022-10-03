import { Empresas } from "app/models/empresas"

export interface Usuario {
    id?: string
    nome?: string
    email?: string
    senha?: string
    idEmpresa?: Empresas
    tipo?: string
}
