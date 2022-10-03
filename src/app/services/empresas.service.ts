import { httpClient } from "app/http";
import { Empresas } from "app/models/empresas";
import { AxiosResponse } from "axios";
import { Page } from 'app/models/common/page'

const resourceURL: string = "/api/empresas"

export const useEmpresaService = () => {

    const salvar = async (empresa: Empresas) : Promise<Empresas> => {
        const response: AxiosResponse<Empresas> = await httpClient.post<Empresas>(resourceURL, empresa)
        return response.data
    }

    const atualizar = async (empresa: Empresas) : Promise<void> => {
        const url: string = `${resourceURL}/${empresa.id}`
        await httpClient.put<Empresas>(url, empresa)
    }

    const carregarEmpresa = async (id: any) : Promise<Empresas> => {
        const url: string = `${resourceURL}/${id}`
        const response: AxiosResponse<Empresas> = await httpClient.get(url)
        return response.data
    }

    const deletar = async (id: any) : Promise<void> => {
        const url: string = `${resourceURL}/${id}`
        await httpClient.delete(url)
    }

    const find = async (
        nome: string = '',
        page: number = 0,
        size: number = 10) : Promise<Page<Empresas>> => {
        const url = `${resourceURL}?nome=${nome}&page=${page}&size=${size}`
        const response: AxiosResponse<Page<Empresas>> = await httpClient.get(url)
        return response.data
    }

    return {
        salvar,
        atualizar,
        carregarEmpresa,
        deletar,
        find
    }
}