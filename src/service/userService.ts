import { ICreateUser, IUpdateUser } from '../interfaces/usuario';
import { IPromiseResponse } from '../interfaces/response';
import { IAcceptCondition } from '../interfaces/condicao';
import { addDoc, collection } from 'firebase/firestore';
import { DBSource } from '../config/database';
import { Resposta, Usuario } from '../models';
import { db } from '../config/firebase';
import termService from './termService';
import { Repository } from 'typeorm';
import serviceTerm from "./termService"

class UserService {
    private repository: Repository<Usuario>
    private repositoryResp: Repository<Resposta>

    constructor() { // inicialização das variáveis objetos dentro da classe
        this.repository = DBSource.getRepository(Usuario)
        this.repositoryResp = DBSource.getRepository(Resposta)
    }

    public async createUser(data: ICreateUser, termos: boolean[], condicoes: boolean[], meio: boolean[]): Promise<IPromiseResponse> {
        try {
            const email = await this.repository.findOneBy({ email: data.email })
            const cpf = await this.repository.findOneBy({ cpf: data.cpf })

            if (cpf !== null || undefined || email !== null || undefined) {
                return { data: 'Email ou CPF já estão sendo utilizados!', msg: 'Erro no cadastro do usuário!' }
            }

            const userEntity = this.repository.create({
                nome: data.nome,
                email: data.email,
                cpf: data.cpf,
                telefone: data.telefone,
                dataNascimento: new Date(data.dataNascimento).toISOString().slice(0, 19).replace('T', ' '),
                senha: data.senha
            })

            const mandatoryTerms = await serviceTerm.getLatestTermMandatory()

            const mandatoryTermsBoolean = termos.filter(Boolean).length

            if (mandatoryTerms.length !== mandatoryTermsBoolean) {
                return { data: `Erro ao criar as condições do usuário: ${mandatoryTermsBoolean}, ${mandatoryTerms}!`, msg: 'Usuário e suas condições não criados por não aceitar termos obrigatórios!' }
            }
            const { conditions, meios } = await serviceTerm.getLatestTermConditions()

            if (conditions.length !== condicoes.length) {
                return { data: `Erro ao criar as condições do usuário: ${conditions}!`, msg: 'Usuário e suas condições não criados por não marcar todos os campos de condições!' }
            }

            if (meio.length !== meios.length) {
                return { data: `Erro ao criar as condições do usuário: ${meios}!`, msg: 'Usuário e suas condições não criados por não marcar todos os campos de meios!' }
            }

            const createUser = await this.repository.save(userEntity)

            const createConditions = await this.acceptConditions(termos, createUser.id, condicoes, meio)

            return { data: { createUser, createConditions }, msg: 'Usuário criado com sucesso!' }
        } catch (error) {
            return { data: 'Erro no cadastro do usuário!', msg: `Erro: ${error}`, }
        }
    }

    public async readUser(id: string): Promise<IPromiseResponse> {
        try {
            const fetch = await this.repository.findOne({
                where: {
                    id: Number(id)
                },
                relations: {
                    resposta: {
                        termo: true
                    }
                }
            })

            if (!fetch) {
                return { data: fetch, msg: 'Usuário não encontrado!' }
            }

            return { data: fetch, msg: 'Usuário encontrado com sucesso!' }
        } catch (error) {
            return { data: 'Erro ao retornar o usuário!', msg: `Erro: ${error}` }
        }
    }

    public async updateUser(id: string, data: IUpdateUser) {
        try {
            const userEntity = await this.repository.findOneBy({ id: Number(id) })

            if (data?.cpf || data?.email) {
                const cpf = await this.repository.findOneBy({ cpf: data?.cpf })
                const email = await this.repository.findOneBy({ email: data?.email })

                console.log((cpf || email) && cpf?.id !== Number(id));
                if ((cpf || email) && email?.id !== Number(id) && cpf?.id !== Number(id)) {
                    return { data: 'Erro ao atualizar o usuário!', msg: `Email ou CPF já estão sendo utilizados!` }
                }
            }

            const info: IUpdateUser = {
                nome: data.nome && data.nome !== userEntity?.nome ? data.nome : userEntity?.nome,
                email: data.email && data.email !== userEntity?.email ? data.email : userEntity?.email,
                cpf: data.email && data.cpf !== userEntity?.cpf ? data.email : userEntity?.cpf,
                telefone: data.telefone && data.telefone !== userEntity?.telefone ? data.telefone : userEntity?.telefone,
                dataNascimento: data.dataNascimento && data.dataNascimento !== undefined && data.dataNascimento !== userEntity?.dataNascimento ? new Date(data.dataNascimento) : userEntity?.dataNascimento,
                senha: data.senha && data.senha !== userEntity?.senha ? data.senha : userEntity?.senha,
            }

            const update = await this.repository.update({ id: Number(id) },
                {
                    nome: info.nome,
                    email: info.email,
                    cpf: info.cpf,
                    telefone: info.telefone,
                    dataNascimento: info.dataNascimento,
                    senha: info.senha
                }
            )

            return { data: update, msg: 'Usuário e suas informações atualizados com sucesso!' }
        } catch (error) {
            return { data: 'Erro ao atualizar o usuário!', msg: `Erro: ${error}` }
        }
    }

    public async updateConditions(id: string, data: boolean[], condicoes: boolean[], meio: boolean[]): Promise<IPromiseResponse> {
        try {
            const mandatoryTerms = await serviceTerm.getLatestTermMandatory()

            const mandatoryTermsBoolean = data.filter(Boolean).length

            if (mandatoryTerms.length !== mandatoryTermsBoolean) {
                return { data: `Erro ao atualizar as condições do usuário: ${mandatoryTerms}!`, msg: 'Usuário e suas condições não atualizados por não aceitar termos obrigatórios!' }
            }

            const { conditions, meios } = await serviceTerm.getLatestTermConditions()

            if (conditions.length !== condicoes.length) {
                return { data: `Erro ao atualizar as condições do usuário: ${conditions}!`, msg: 'Usuário e suas condições não atualizados por não marcar todos os campos de condições!' }
            }

            if (meio.length !== meios.length) {
                return { data: `Erro ao atualizar as condições do usuário: ${meios}!`, msg: 'Usuário e suas condições não atualizados por não marcar todos os campos de meios!' }
            }

            const update = this.acceptConditions(data, Number(id), condicoes, meio)

            return { data: update, msg: 'Usuário e suas condições atualizados com sucesso!' }
        } catch (error) {
            return { data: 'Erro ao atualizar as condições do usuário!', msg: `Erro: ${error}` }
        }
    }

    public async deleteUser(id: string): Promise<IPromiseResponse> {
        try {
            const deletion = await this.repository.delete(id)

            const ref = await addDoc(collection(db, 'deleted'), { id: id })

            return { data: { deletion, ref }, msg: 'Usuário e suas informações deletados com sucesso!' }
        } catch (error) {
            return { data: 'Erro ao deletar o usuário!', msg: `Erro: ${error}` }
        }
    }

    public async acceptConditions(data: boolean[], id: number, condicoes: boolean[], meios: boolean[]) {
        try {
            const term = await termService.getLatestTerm()

            const accept = this.repositoryResp.create({
                obrigatorios: String(data),
                condicoes: String(condicoes),
                meios: String(meios),
                data: new Date().toISOString().slice(0, 19).replace('T', ' '),
                usuario: { id: id },
                termo: { id: term }
            })

            await this.repositoryResp.save(accept)

            return { data: accept, msg: 'Condições registradas com sucesso!' }
        } catch (error) {
            return { data: 'Erro ao criar as condições!', msg: `Erro: ${error}` }
        }
    }

    public async verifyEmail(email: string): Promise<Usuario | null | undefined> {
        try {
            const user = await this.repository
                .createQueryBuilder('usuario')
                .leftJoinAndSelect('usuario.resposta', 'resposta')
                .leftJoinAndSelect('resposta.termo', 'termo')
                .where('usuario.email = :email', { email })
                .orderBy('resposta.id', 'DESC')
                .getOne();
            return user || undefined || null;
        } catch (error) {
            throw error;
        }
    }
}

export default new UserService()