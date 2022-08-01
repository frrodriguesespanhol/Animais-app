import { httpClient } from "app/http";
import { Selecoes } from "app/models/selecoes";
import { AxiosResponse } from "axios";
import { Page } from 'app/models/common/page'

const resourceURL: string = "/api/selecoes"

export const useSelecaoService = () => {

    const salvar = async (selecao: Selecoes) : Promise<Selecoes> => {
        const response: AxiosResponse<Selecoes> = await httpClient.post<Selecoes>(resourceURL, selecao)
        return response.data
    }

    const atualizar = async (selecao: Selecoes) : Promise<void> => {
        const url: string = `${resourceURL}/${selecao.id}`
        await httpClient.put<Selecoes>(url, selecao)
    }

    const carregarSelecao = async (id: any) : Promise<Selecoes> => {
        const url: string = `${resourceURL}/${id}`
        const response: AxiosResponse<Selecoes> = await httpClient.get(url)
        return response.data
    }

    const deletar = async (id: any) : Promise<void> => {
        const url: string = `${resourceURL}/${id}`
        await httpClient.delete(url)
    }

    const find = async (
        nome: string = '',
        page: number = 0,
        size: number = 10) : Promise<Page<Selecoes>> => {
        const url = `${resourceURL}?nome=${nome}&page=${page}&size=${size}`
        const response: AxiosResponse<Page<Selecoes>> = await httpClient.get(url)
        return response.data
    }

    return {
        salvar,
        atualizar,
        carregarSelecao,
        deletar,
        find
    }
}