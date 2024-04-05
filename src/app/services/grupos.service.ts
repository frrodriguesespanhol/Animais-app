import { httpClient } from "app/http";
import { Grupos } from "app/models/grupos";
import { AxiosResponse } from "axios";
import { Page } from 'app/models/common/page'

const resourceURL: string = "/api/grupos"

export const useGrupoService = () => {

    const salvar = async (grupos: Grupos) : Promise<Grupos> => {
        const response: AxiosResponse<Grupos> = await httpClient.post<Grupos>(resourceURL, grupos)
        return response.data
    }

    const atualizar = async (grupos: Grupos) : Promise<void> => {
        const url: string = `${resourceURL}/${grupos.id}`
        await httpClient.put<Grupos>(url, grupos)
    }

    const carregarGrupo = async (id: any) : Promise<Grupos> => {
        const url: string = `${resourceURL}/${id}`
        const response: AxiosResponse<Grupos> = await httpClient.get(url)
        return response.data
    }

    const deletar = async (id: any) : Promise<void> => {
        const url: string = `${resourceURL}/${id}`
        await httpClient.delete(url)
    }

    const find = async (
        nome: string = '',
        page: number = 0,
        size: number = 10) : Promise<Page<Grupos>> => {
        const url = `${resourceURL}?nome=${nome}&page=${page}&size=${size}`
        const response: AxiosResponse<Page<Grupos>> = await httpClient.get(url)
        return response.data
    }

    return {
        salvar,
        atualizar,
        carregarGrupo,
        deletar,
        find
    }
}