import { httpClient } from "app/http";
import { Cidade } from "app/models/cidades";
import { AxiosResponse } from "axios";
import { Page } from 'app/models/common/page'
import { Selecoes } from "app/models/selecoes";
import { Jogos } from "app/models/Jogos";


const resourceURL: string = "/api/jogos"

export const useJogoService = () => {

    const salvar = async (jogos: Jogos) : Promise<Jogos> => {
        const response: AxiosResponse<Jogos> = await httpClient.post<Jogos>(resourceURL, jogos)
        return response.data
    }

    const atualizar = async (jogos: Jogos) : Promise<void> => {
        const url: string = `${resourceURL}/${jogos.id}`
        await httpClient.put<Jogos>(url, jogos)
    }

    const carregarJogo = async (id: any) : Promise<Jogos> => {
        const url: string = `${resourceURL}/${id}`
        const response: AxiosResponse<Jogos> = await httpClient.get(url)
        return response.data
    }

    const deletar = async (id: any) : Promise<void> => {
        const url: string = `${resourceURL}/${id}`
        await httpClient.delete(url)
    }

    const find = async (
        selecao: string = '',
        page: number = 0,
        size: number = 10) : Promise<Page<Jogos>> => {
        const url = `${resourceURL}?selecao=${selecao}&page=${page}&size=${size}`
        const response: AxiosResponse<Page<Jogos>> = await httpClient.get(url)
        return response.data
    }

    return {
        salvar,
        atualizar,
        carregarJogo,
        deletar,
        find
    }
}