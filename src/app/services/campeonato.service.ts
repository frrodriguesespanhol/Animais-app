import { httpClient } from "app/http";
import { Campeonato } from "app/models/campeonatos";
import { AxiosResponse } from "axios";
import { Page } from 'app/models/common/page'

const resourceURL: string = "/api/campeonatos"

export const useCampeonatoService = () => {

    const salvar = async (campeonato: Campeonato) : Promise<Campeonato> => {
        const response: AxiosResponse<Campeonato> = await httpClient.post<Campeonato>(resourceURL, campeonato)
        return response.data
    }

    const atualizar = async (campeonato: Campeonato) : Promise<void> => {
        const url: string = `${resourceURL}/${campeonato.id}`
        await httpClient.put<Campeonato>(url, campeonato)
    }

    const carregarCampeonato = async (id: any) : Promise<Campeonato> => {
        const url: string = `${resourceURL}/${id}`
        const response: AxiosResponse<Campeonato> = await httpClient.get(url)
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
        size: number = 10) : Promise<Page<Campeonato>> => {
        const url = `${resourceURL}?nome=${nome}&ano=${ano}&page=${page}&size=${size}`
        const response: AxiosResponse<Page<Campeonato>> = await httpClient.get(url)
        return response.data
    }

    return {
        salvar,
        atualizar,
        carregarCampeonato,
        deletar,
        find
    }
}