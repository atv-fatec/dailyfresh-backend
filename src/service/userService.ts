import { IPromiseResponse } from "../interfaces/response";
import { ICreateUser } from "../interfaces/usuario";
import { DBSource } from "../config/database";
import { Repository } from "typeorm";
import { Resposta, Usuario } from "../models";
import { IAcceptCondition } from "../interfaces/condicao";
import termService from "./termService";

class UserService {
    private repository: Repository<Usuario>
    private repositoryResp: Repository<Resposta>

    constructor() { // inicialização das variáveis objetos dentro da classe
        this.repository = DBSource.getRepository(Usuario)
        this.repositoryResp = DBSource.getRepository(Resposta)
    }

    public async createUser(data: ICreateUser, termos: IAcceptCondition): Promise<IPromiseResponse> {
        try {
            const userEntity = this.repository.create({
                nome: data.nome,
                email: data.email,
                cpf: data.cpf,
                telefone: data.telefone,
                dataNascimento: new Date(data.dataNascimento).toISOString().slice(0, 19).replace('T', ' '),
                senha: data.senha
            })

            const userInsert = await this.repository.save(userEntity)            
            
            const insert = await this.acceptConditions(termos, userInsert.id)            

            return { data: { userInsert, insert}, msg: 'Usuário criado com sucesso!' }
        } catch (error) {
            return { data: '', msg: `Erro: ${error}` }
        }
    }

    public async readUser(id: string): Promise<IPromiseResponse> {
        try {
            const search = await this.repository.findOne({
                where: {
                    id: Number(id)
                },
                relations: {
                    resposta: {
                        termo: true
                    }
                }
            })

            if (!search) {
                return { data: search, msg: 'Usuário não encontrado!' }
            }

            return { data: search, msg: 'Usuário encontrado com sucesso!' }
        } catch (error) {
            return { data: '', msg: `Erro: ${error}` }
        }
    }

    public async acceptConditions(data: IAcceptCondition, id: number) {
        try {
            const term = await termService.getLatestTerm()

            const acceptEntity = this.repositoryResp.create({
                armazenamentoDados: data.armazenamentoDados,
                pagamentoDados: data.pagamentoDados,
                propagandas: data.propagandas,
                envioEmail: data.envioEmail,
                envioSms: data.envioSms,
                usuario: { id: id },
                termo: { id: term }
            })
            
            await this.repository.save(acceptEntity)

            return { data: acceptEntity, msg: 'Condições registradas com sucesso!' }
        } catch (error) {
            return { data: '', msg: `Erro: ${error}` }
        }
    }
}

export default new UserService()