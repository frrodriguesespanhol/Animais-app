import { httpClient } from "app/http";
import { AxiosResponse } from "axios";
import { Page } from 'app/models/common/page'
import { Configuracao } from "app/models/configuracao";


const resourceURL: string = "/api/configuracao"

export const useConfiguracaoService = () => {

    const salvar = async (configuracao: Configuracao) : Promise<Configuracao> => {
        console.log(configuracao) // retirar logs depois
        const response: AxiosResponse<Configuracao> = await httpClient.post<Configuracao>(resourceURL, configuracao)
        return response.data
    }

    const atualizar = async (configuracao: Configuracao) : Promise<void> => {
        const url: string = `${resourceURL}/${configuracao.id}`
        await httpClient.put<Configuracao>(url, configuracao)
    }

    const carregarConfiguracao = async (id: any) : Promise<Configuracao> => {
        const url: string = `${resourceURL}/${id}`
        const response: AxiosResponse<Configuracao> = await httpClient.get(url)
        return response.data
    }

    const deletar = async (id: any) : Promise<void> => {
        const url: string = `${resourceURL}/${id}`
        await httpClient.delete(url)
    }

    const find = async (
        empresa: string = '',
        campeonato: string = '',
        page: number = 0,
        size: number = 10) : Promise<Page<Configuracao>> => {
        const url = `${resourceURL}?empresa=${empresa}&campeonato=${campeonato}&page=${page}&size=${size}`
        const response: AxiosResponse<Page<Configuracao>> = await httpClient.get(url)
        return response.data
    }

    return {
        salvar,
        atualizar,
        carregarConfiguracao,
        deletar,
        find
    }
}