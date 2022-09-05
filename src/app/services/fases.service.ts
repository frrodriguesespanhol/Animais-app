import { httpClient } from "app/http";
import { Fases } from "app/models/fases";
import { AxiosResponse } from "axios";
import { Page } from 'app/models/common/page'

const resourceURL: string = "/api/fases"

export const useFaseService = () => {

    const salvar = async (fase: Fases) : Promise<Fases> => {
        const response: AxiosResponse<Fases> = await httpClient.post<Fases>(resourceURL, fase)
        return response.data
    }

    const atualizar = async (fase: Fases) : Promise<void> => {
        const url: string = `${resourceURL}/${fase.id}`
        await httpClient.put<Fases>(url, fase)
    }

    const carregarFase = async (id: any) : Promise<Fases> => {
        const url: string = `${resourceURL}/${id}`
        const response: AxiosResponse<Fases> = await httpClient.get(url)
        return response.data
    }

    const deletar = async (id: any) : Promise<void> => {
        const url: string = `${resourceURL}/${id}`
        await httpClient.delete(url)
    }

    const find = async (
        nome: string = '',
        page: number = 0,
        size: number = 10) : Promise<Page<Fases>> => {
        const url = `${resourceURL}?nome=${nome}&page=${page}&size=${size}`
        const response: AxiosResponse<Page<Fases>> = await httpClient.get(url)
        return response.data
    }

    return {
        salvar,
        atualizar,
        carregarFase,
        deletar,
        find
    }
}