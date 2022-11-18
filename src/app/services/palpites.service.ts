import { httpClient } from "app/http";
import { AxiosResponse } from "axios";
import { Page } from 'app/models/common/page'
import { Palpites } from "app/models/palpites";
import { Ranking } from "pages";


const resourceURL: string = "/api/palpites"

export const usePalpiteService = () => {

    // palpite não salva, apenas atualiza
    // const salvar = async (palpites: Palpites) : Promise<Palpites> => {
    //     const response: AxiosResponse<Palpites> = await httpClient.post<Palpites>(resourceURL, palpites)
    //     return response.data
    // }

    const atualizar = async (palpites: Palpites) => {
        const url: string = `${resourceURL}/${palpites.id}`
        const response = await httpClient.put<Palpites>(url, palpites)
        //console.log(response.data)
        return response.data
    }

    const carregarPalpite = async (id: any) : Promise<Palpites> => {
        const url: string = `${resourceURL}/${id}`
        const response: AxiosResponse<Palpites> = await httpClient.get(url)
        return response.data
    }

    // não deleta palpite, apenas atualiza
    // const deletar = async (id: any) : Promise<void> => {
    //     const url: string = `${resourceURL}/${id}`
    //     await httpClient.delete(url)
    // }

    const find = async (
        data: string = '',
        usuario: string = '',
        page: number = 0,
        size: number = 10) : Promise<Page<Palpites>> => {
        const url = `${resourceURL}?data=${data}&usuario=${usuario}&page=${page}&size=${size}`
        const response: AxiosResponse<Page<Palpites>> = await httpClient.get(url)
        return response.data
    }

    const ranking = async (
        page: number = 0,
        size: number = 50) : Promise<Page<Ranking>> => {
        const url = `${resourceURL}/ranking?page=${page}&size=${size}`
        const response: AxiosResponse<Page<Ranking>> = await httpClient.get(url)
        //console.log(response.data)
        return response.data
    }

    const proximoJogo = async (
        data: Date | undefined = undefined,
        usuario: string = '',
        page: number = 0,
        size: number = 10) : Promise<Page<Palpites>> => {
        const url = `${resourceURL}?data=${data}&usuario=${usuario}&page=${page}&size=${size}`
        const response: AxiosResponse<Page<Palpites>> = await httpClient.get(url)
        return response.data
    }

    return {
        //salvar,
        atualizar,
        carregarPalpite,
        //deletar,
        find,
        ranking,
        proximoJogo
    }
}