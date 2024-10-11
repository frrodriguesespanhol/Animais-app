import { httpClient } from "app/http";
import { Animais } from "app/models/animais";
import { AxiosResponse } from "axios";
import { Page } from 'app/models/common/page'

const resourceURL: string = "/api/animais"

export const useAnimaisService = () => {

    const salvar = async (animais: Animais) : Promise<Animais> => {
        console.log(animais)
        const response: AxiosResponse<Animais> = await httpClient.post<Animais>(resourceURL, animais)
        return response.data
    }

    const atualizar = async (animais: Animais) : Promise<void> => {
        const url: string = `${resourceURL}/${animais.id}`
        console.log('animais especie:' + animais.idEspecieAnimal)
        await httpClient.put<Animais>(url, animais)
    }

    const atualizarFoto = async (endereco: string, id: string | undefined, foto: string | undefined) : Promise<void> => {
        const url: string = `${resourceURL}/${id}`
        //console.log('foto:' + {foto: endereco})
        if (foto =='foto1')
            await httpClient.patch(url, {foto1: endereco})
        else
            await httpClient.patch(url, {foto2: endereco})
    }

    const carregarAnimal = async (id: any) : Promise<Animais> => {
        const url: string = `${resourceURL}/${id}`
        const response: AxiosResponse<Animais> = await httpClient.get(url)
        return response.data
    }

    const deletar = async (id: any) : Promise<void> => {
        const url: string = `${resourceURL}/${id}`
        await httpClient.delete(url)
    }

    const find = async (
        // idGrupoAnimal: string = '',
        // idClassificacaoAnimal: string = '',
        idEspecieAnimal: string = '',
        especie: string = '',
        cadastradopor: string = '',
        page: number = 0,
        size: number = 10) : Promise<Page<Animais>> => {
        //const url = `${resourceURL}?grupo=${idGrupoAnimal}&classificacao=${idClassificacaoAnimal}&especie=${idEspecieAnimal}&page=${page}&size=${size}`
        const url = `${resourceURL}?idEspecieAnimal=${idEspecieAnimal}&especie=${especie}&cadastradopor=${cadastradopor}&page=${page}&size=${size}`
        const response: AxiosResponse<Page<Animais>> = await httpClient.get(url)
        return response.data
    }

    return {
        salvar,
        atualizar,
        carregarAnimal,
        deletar,
        find,
        atualizarFoto
    }
}