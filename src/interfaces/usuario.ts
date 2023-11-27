import { IAcceptCondition } from "./condicao"

export interface IUser{
    email: string,
    senha: string
}

export interface ICreateUser {
    nome: string,
    email: string,
    cpf: string,
    telefone: string,
    dataNascimento: Date,
    senha: string
}

export interface IReadUser {
    id: number,
    nome: string,
    email: string,
    cpf: string,
    telefone: string,
    dataNascimento: Date,
    senha: string
}

export interface IUpdateUser {
    nome?: string,
    //email?: string,
    //cpf?: string,
    telefone?: string,
    dataNascimento?: Date,
    senha?: string,
    termos?: IAcceptCondition
}