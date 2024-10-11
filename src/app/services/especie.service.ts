import { httpClient } from "app/http";
import { Especie } from "app/models/especies";
import { AxiosResponse } from "axios";
import { Page } from 'app/models/common/page'

const resourceURL: string = "/api/especies"

export const useEspecieService = () => {

    const salvar = async (especie: Especie) : Promise<Especie> => {
        const response: AxiosResponse<Especie> = await httpClient.post<Especie>(resourceURL, especie)
        return response.data
    }

    const atualizar = async (especie: Especie) : Promise<void> => {
        const url: string = `${resourceURL}/${especie.id}`
        await httpClient.put<Especie>(url, especie)
    }

    const carregarEspecie = async (id: any) : Promise<Especie> => {
        const url: string = `${resourceURL}/${id}`
        const response: AxiosResponse<Especie> = await httpClient.get(url)
        return response.data
    }

    const deletar = async (id: any) : Promise<void> => {
        const url: string = `${resourceURL}/${id}`
        await httpClient.delete(url)
    }

    const find = async (
        nome: string = '',
        //idClassificacao: string = '',
        page: number = 0,
        size: number = 10) : Promise<Page<Especie>> => {
        //const url = `${resourceURL}?nome=${nome}&idClassificacao=${idClassificacao}&page=${page}&size=${size}`
        const url = `${resourceURL}?nome=${nome}&page=${page}&size=${size}`
        const response: AxiosResponse<Page<Especie>> = await httpClient.get(url)
        return response.data
    }

    const find_combo = async (
        nome: string='',
        // idClassificacao: string = '',
        page: number = 0,
        size: number = 10) : Promise<Page<Especie>> => {
        // const url = `${resourceURL}?nome=${nome}&idClassificacao=${idClassificacao}&page=${page}&size=${size}`
        const url = `${resourceURL}?nome=${nome}&page=${page}&size=${size}`
        const response: AxiosResponse<Page<Especie>> = await httpClient.get(url)
        return response.data
    }

    return {
        salvar,
        atualizar,
        carregarEspecie,
        deletar,
        find,
        find_combo
    }
}