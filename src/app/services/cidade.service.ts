import { httpClient } from "app/http";
import { Cidade } from "app/models/cidades";
import { AxiosResponse } from "axios";
import { Page } from 'app/models/common/page'
import { Copa } from "app/models/copas";

const resourceURL: string = "/api/cidades"

export const useCidadeService = () => {

    const salvar = async (cidade: Cidade) : Promise<Cidade> => {
    //const salvar = async (cidade: Cidade) : Promise<void> => {
        const response: AxiosResponse<Cidade> = await httpClient.post<Cidade>(resourceURL, cidade)
        console.log(cidade)
        //await httpClient.post<Cidade>(resourceURL, cidade)
        return response.data
    }

    const atualizar = async (cidade: Cidade) : Promise<void> => {
        const url: string = `${resourceURL}/${cidade.id}`
        await httpClient.put<Cidade>(url, cidade)
    }

    const carregarCidade = async (id: any) : Promise<Cidade> => {
        const url: string = `${resourceURL}/${id}`
        const response: AxiosResponse<Cidade> = await httpClient.get(url)
        return response.data
    }

    const deletar = async (id: any) : Promise<void> => {
        const url: string = `${resourceURL}/${id}`
        await httpClient.delete(url)
    }

    const find = async (
        nome: string = '',
        idCopa: string = '',
        page: number = 0,
        size: number = 10) : Promise<Page<Cidade>> => {
        const url = `${resourceURL}?nome=${nome}&idCopa=${idCopa}&page=${page}&size=${size}`
        const response: AxiosResponse<Page<Cidade>> = await httpClient.get(url)
        return response.data
    }

    return {
        salvar,
        atualizar,
        carregarCidade,
        deletar,
        find
    }
}