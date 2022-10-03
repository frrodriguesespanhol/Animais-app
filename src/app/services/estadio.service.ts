import { httpClient } from "app/http";
import { AxiosResponse } from "axios";
import { Page } from 'app/models/common/page'
import { Estadio } from "app/models/estadios";

const resourceURL: string = "/api/estadios"

export const useEstadioService = () => {

    const salvar = async (estadio: Estadio) : Promise<Estadio> => {
        const response: AxiosResponse<Estadio> = await httpClient.post<Estadio>(resourceURL, estadio)
        return response.data
    }

    const atualizar = async (estadio: Estadio) : Promise<void> => {
        const url: string = `${resourceURL}/${estadio.id}`
        await httpClient.put<Estadio>(url, estadio)
    }

    const carregarEstadio = async (id: any) : Promise<Estadio> => {
        const url: string = `${resourceURL}/${id}`
        const response: AxiosResponse<Estadio> = await httpClient.get(url)
        return response.data
    }

    const deletar = async (id: any) : Promise<void> => {
        const url: string = `${resourceURL}/${id}`
        await httpClient.delete(url)
    }

    const find = async (
        nome: string = '',
        idCidade: string = '',
        page: number = 0,
        size: number = 10) : Promise<Page<Estadio>> => {
        const url = `${resourceURL}?nome=${nome}&idCidade=${idCidade}&page=${page}&size=${size}`
        const response: AxiosResponse<Page<Estadio>> = await httpClient.get(url)
        return response.data
    }

    return {
        salvar,
        atualizar,
        carregarEstadio,
        deletar,
        find
    }
}