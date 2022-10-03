import { httpClient } from "app/http";
import { Usuario } from "app/models/usuarios";
import { AxiosResponse } from "axios";
import { Page } from 'app/models/common/page'

const resourceURL: string = "/api/usuarios"

export const useUsuarioService = () => {

    const salvar = async (usuario: Usuario) : Promise<Usuario> => {
        console.log(usuario)
        const response: AxiosResponse<Usuario> = await httpClient.post<Usuario>(resourceURL, usuario)
        console.log(usuario)
        return response.data
    }

    const atualizar = async (usuario: Usuario) : Promise<void> => {
        const url: string = `${resourceURL}/${usuario.id}`
        await httpClient.put<Usuario>(url, usuario)
    }

    const carregarUsuario = async (id: any) : Promise<Usuario> => {
        const url: string = `${resourceURL}/${id}`
        const response: AxiosResponse<Usuario> = await httpClient.get(url)
        return response.data
    }

    const deletar = async (id: any) : Promise<void> => {
        const url: string = `${resourceURL}/${id}`
        await httpClient.delete(url)
    }

    const find = async (
        nome: string = '',
        idEmpresa: string = '',
        page: number = 0,
        size: number = 10) : Promise<Page<Usuario>> => {
        const url = `${resourceURL}?nome=${nome}&idEmpresa=${idEmpresa}&page=${page}&size=${size}`
        const response: AxiosResponse<Page<Usuario>> = await httpClient.get(url)
        return response.data
    }

    return {
        salvar,
        atualizar,
        carregarUsuario,
        deletar,
        find
    }
}