import { Copa } from "../copas";
import { Produto } from "../produtos";

export interface Venda {
    cliente?: Copa
    itens?: Array<ItemVenda>
    formaPagamento?: string
    total: number
}

export interface ItemVenda {
    produto: Produto
    quantidade: number
}