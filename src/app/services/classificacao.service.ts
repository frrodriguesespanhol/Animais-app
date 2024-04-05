import { httpClient } from "app/http";
import { Classificacao } from "app/models/classificacao";
import { AxiosResponse } from "axios";
import { Page } from 'app/models/common/page'

const resourceURL: string = "/api/classificacoes"

export const useClassificacaoService = () => {

    const salvar = async (classificacao: Classificacao) : Promise<Classificacao> => {
        const response: AxiosResponse<Classificacao> = await httpClient.post<Classificacao>(resourceURL, classificacao)
        return response.data
    }

    const atualizar = async (classificacao: Classificacao) : Promise<void> => {
        const url: string = `${resourceURL}/${classificacao.id}`
        await httpClient.put<Classificacao>(url, classificacao)
    }

    const carregarClassificacao = async (id: any) : Promise<Classificacao> => {
        const url: string = `${resourceURL}/${id}`
        const response: AxiosResponse<Classificacao> = await httpClient.get(url)
        return response.data
    }

    const deletar = async (id: any) : Promise<void> => {
        const url: string = `${resourceURL}/${id}`
        await httpClient.delete(url)
    }

    const find = async (
        nome: string = '',
        idGrupo: string = '',
        page: number = 0,
        size: number = 10) : Promise<Page<Classificacao>> => {
        const url = `${resourceURL}?nome=${nome}&idGrupo=${idGrupo}&page=${page}&size=${size}`
        const response: AxiosResponse<Page<Classificacao>> = await httpClient.get(url)
        console.log(url)
        return response.data
    }

    const find_combo = async (
        nome: string ='',
        idGrupo: string = '',
        page: number = 0,
        size: number = 10) : Promise<Page<Classificacao>> => {
        const url = `${resourceURL}?nome=${nome}&idGrupo=${idGrupo}&page=${page}&size=${size}`
        const response: AxiosResponse<Page<Classificacao>> = await httpClient.get(url)
        console.log(url)
        return response.data
    }

    return {
        salvar,
        atualizar,
        carregarClassificacao,
        deletar,
        find,
        find_combo
    }
}