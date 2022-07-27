import { httpClient } from "app/http";
import { Copa } from "app/models/copas";
import { AxiosResponse } from "axios";
import { Page } from 'app/models/common/page'

const resourceURL: string = "/api/copas"

export const useCopaService = () => {

    const salvar = async (copa: Copa) : Promise<Copa> => {
        const response: AxiosResponse<Copa> = await httpClient.post<Copa>(resourceURL, copa)
        return response.data
    }

    const atualizar = async (copa: Copa) : Promise<void> => {
        const url: string = `${resourceURL}/${copa.id}`
        await httpClient.put<Copa>(url, copa)
    }

    const carregarCopa = async (id: any) : Promise<Copa> => {
        const url: string = `${resourceURL}/${id}`
        const response: AxiosResponse<Copa> = await httpClient.get(url)
        return response.data
    }

    const deletar = async (id: any) : Promise<void> => {
        const url: string = `${resourceURL}/${id}`
        await httpClient.delete(url)
    }

    const find = async (
        nome: string = '',
        ano: string = '',
        page: number = 0,
        size: number = 10) : Promise<Page<Copa>> => {
        const url = `${resourceURL}?nome=${nome}&ano=${ano}&page=${page}&size=${size}`
        const response: AxiosResponse<Page<Copa>> = await httpClient.get(url)
        return response.data
    }

    return {
        salvar,
        atualizar,
        carregarCopa,
        deletar,
        find
    }
}