import { httpClient } from "app/http";
import { Paises } from "app/models/paises";
import { AxiosResponse } from "axios";
import { Page } from 'app/models/common/page'

const resourceURL: string = "/api/paises"

export const usePaisesService = () => {

    const salvar = async (paises: Paises) : Promise<Paises> => {
        const response: AxiosResponse<Paises> = await httpClient.post<Paises>(resourceURL, paises)
        return response.data
    }

    const atualizar = async (paises: Paises) : Promise<void> => {
        const url: string = `${resourceURL}/${paises.id}`
        await httpClient.put<Paises>(url, paises)
    }

    const carregarPais = async (id: any) : Promise<Paises> => {
        const url: string = `${resourceURL}/${id}`
        const response: AxiosResponse<Paises> = await httpClient.get(url)
        return response.data
    }

    const deletar = async (id: any) : Promise<void> => {
        const url: string = `${resourceURL}/${id}`
        await httpClient.delete(url)
    }

    const find = async (
        nome: string = '',
        page: number = 0,
        size: number = 10) : Promise<Page<Paises>> => {
        const url = `${resourceURL}?nome=${nome}&page=${page}&size=${size}`
        const response: AxiosResponse<Page<Paises>> = await httpClient.get(url)
        return response.data
    }

    return {
        salvar,
        atualizar,
        carregarPais,
        deletar,
        find
    }
}