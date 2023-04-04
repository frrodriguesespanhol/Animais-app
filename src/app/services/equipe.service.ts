import { httpClient } from "app/http";
import { Equipes } from "app/models/equipes";
import { AxiosResponse } from "axios";
import { Page } from 'app/models/common/page'

const resourceURL: string = "/api/equipes"

export const useEquipeService = () => {

    const salvar = async (equipe: Equipes) : Promise<Equipes> => {
        const response: AxiosResponse<Equipes> = await httpClient.post<Equipes>(resourceURL, equipe)
        return response.data
    }

    const atualizar = async (equipe: Equipes) : Promise<void> => {
        const url: string = `${resourceURL}/${equipe.id}`
        await httpClient.put<Equipes>(url, equipe)
    }

    const carregarEquipe = async (id: any) : Promise<Equipes> => {
        const url: string = `${resourceURL}/${id}`
        const response: AxiosResponse<Equipes> = await httpClient.get(url)
        return response.data
    }

    const deletar = async (id: any) : Promise<void> => {
        const url: string = `${resourceURL}/${id}`
        await httpClient.delete(url)
    }

    const find = async (
        nome: string = '',
        page: number = 0,
        size: number = 10) : Promise<Page<Equipes>> => {
        const url = `${resourceURL}?nome=${nome}&page=${page}&size=${size}`
        const response: AxiosResponse<Page<Equipes>> = await httpClient.get(url)
        return response.data
    }

    return {
        salvar,
        atualizar,
        carregarEquipe,
        deletar,
        find
    }
}