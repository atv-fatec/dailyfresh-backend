import { IPromiseResponse } from "../interfaces/response";
import { ICreateTerm } from "../interfaces/termo";
import { DBSource } from "../config/database";
import { Repository } from "typeorm";
import { Resposta, Termo } from "../models";

class TermService {
    private respository: Repository<Termo>
    private repositoryResp: Repository<Resposta>

    constructor() { // inicialização das variáveis objetos dentro da classe
        this.respository = DBSource.getRepository(Termo)
        this.repositoryResp = DBSource.getRepository(Resposta)
    }

    public async createTerm(data: ICreateTerm): Promise<IPromiseResponse> {
        try {
            const termEntity = this.respository.create({
                versao: data.versao,
                mensagem: data.mensagem,
                data: new Date()
            })

            await this.respository.save(termEntity)
            await this.repositoryResp.update({}, {
                armazenamentoDados: false,
                pagamentoDados: false,
                propagandas: false,
                envioEmail: false,
                envioSms: false
            });

            return { data: termEntity, msg: 'Termo criado com sucesso!' }
        } catch (error) {
            return { data: 'Erro ao criar os termos!', msg: `Erro: ${error}` }
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
            return { data: 'Erro ao retornar os termos!', msg: `Erro: ${error}` }
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