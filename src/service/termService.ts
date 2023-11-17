import { IPromiseResponse } from "../interfaces/response";
import { ICreateTerm } from "../interfaces/termo";
import { DBSource } from "../config/database";
import { Repository } from "typeorm";
import { Termo } from "../models";

class TermService {
    private respository: Repository<Termo>

    constructor() { // inicialização das variáveis objetos dentro da classe
        this.respository = DBSource.getRepository(Termo)
    }

    public async createTerm(data: ICreateTerm): Promise<IPromiseResponse> {
        try {
            const termEntity = this.respository.create({
                versao: data.versao,
                mensagem: data.mensagem,
                data: new Date()
            })

            await this.respository.save(termEntity)

            return { data: termEntity, msg: 'Termo criado com sucesso!' }
        } catch (error) {
            return { data: '', msg: `Erro: ${error}` }
        }
    }

    public async readTerm(id: string): Promise<IPromiseResponse> {
        try {
            const search = await this.respository.findOne({
                where: {
                    id: Number(id)
                },
                relations: {
                    resposta: {
                        usuario: true
                    }
                }
            })

            if (!search) {
                return { data: search, msg: 'Termo não encontrado!' }
            }

            return { data: search, msg: 'Termo encontrado com sucesso!' }
        } catch (error) {
            return { data: '', msg: `Erro: ${error}` }
        }
    }

    public async getLatestTerm(): Promise<number> {
        const search = await this.respository.findOne({
            where: {},
            order: {
                id: 'DESC'
            }
        })

        if (!search?.id) {
            return 0
        }        

        return search?.id
    }
}

export default new TermService()