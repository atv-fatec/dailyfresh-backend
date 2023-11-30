import { IAcceptCondition } from '../interfaces/condicao'
import { ICreateUser, IUser } from '../interfaces/usuario'
import { Usuario } from '../models'
import userService from '../service/userService'
import serviceTerm from '../service/termService'
import { Request, Response } from 'express'

class UserController {
    private static legalAdult(dataNascimento: Date): number {
        const data = new Date(dataNascimento)
        const hoje = new Date()

        let idade = hoje.getFullYear() - data.getFullYear()

        if (hoje.getMonth() + 1 < data.getMonth() + 1 || (hoje.getMonth() + 1 === data.getMonth() + 1 && hoje.getDate() < data.getDate())) {
            idade--;
        }

        return idade
    }

    public async userLogin(req: Request, res: Response) {
        try {
            const fields: string[] = ["email", "senha"];
            const errors: string[] = [];

            fields.forEach((field) => {
                if (!req.body[field]) {
                    errors.push(`Missing ${field} field`);
                }
            });

            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }

            const user: IUser = req.body

            const userEmail: Usuario | undefined | null = await userService.verifyEmail(user.email)
           
            if (!userEmail?.email) {
                return res.status(401).json({ error: "Por favor, cheque as suas credenciais e tente novamente." })
            }

            const isPasswordValid = user.senha === userEmail.senha

            if (!isPasswordValid) {
                return res.status(401).json({ error: "Por favor, cheque as suas credenciais e tente novamente." });
            }

            const userLastTerm = userEmail?.resposta[0].termo.id
            const lastTerm = await serviceTerm.getLatestTerm()
            const equalTerm = userLastTerm == lastTerm ? true : false

            if(!equalTerm){
                return res.status(401).json({ error: "Por favor, concorde com o ultimo termo." });
            }

            const data = { ...userEmail };
            return res.json(data);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    public async createUser(req: Request, res: Response) {
        try {
            const data: ICreateUser = req.body
            const conditions: IAcceptCondition = req.body.termos
            const obrigatorio: (keyof ICreateUser)[] = ['nome', 'email', 'cpf', 'telefone', 'dataNascimento', 'senha']
            const validacao = obrigatorio.every(properties => data[properties] !== undefined && data[properties] !== null)

            if (!validacao) {
                return res.status(400).json({
                    data: 'Cadastro não concluído por não preencher os campos obrigatórios!'
                })
            }

            if (!conditions.armazenamentoDados || !conditions.pagamentoDados) {
                return res.status(400).json({
                    data: 'Cadastro não concluído por não concordar com os termos obrigatórios!'
                })
            }

            if (UserController.legalAdult(data.dataNascimento) < 18) {
                return res.status(400).json({
                    data: 'Cadastro não concluído por não ser maior de idade!'
                })
            }

            const create = await userService.createUser(data, conditions)
             
            res.status(200).json(create)
        } catch (error) {
            res.status(400).json({ data: 'Erro no cadastro do usuário!', msg: `Erro: ${error}` })
        }
    }

    public async readUser(req: Request, res: Response) {
        try {
            const { id } = req.params

            const read = await userService.readUser(id)

            res.status(200).json(read)
        } catch (error) {
            res.status(400).json({ data: 'Erro ao retornar o usuário!', msg: `Erro: ${error}` })
        }
    }

    public async updateUser(req: Request, res: Response) {
        try {
            const { id } = req.params
            const data = req.body

            const update = await userService.updateUser(id, data)

            res.status(200).json(update)
        } catch (error) {
            res.status(400).json({ data: 'Erro ao retornar o usuário!', msg: `Erro: ${error}` })
        }
    }

    public async updateConditions(req: Request, res: Response) {
        try {
            const { id } = req.params
            const data = req.body

            const update = await userService.updateConditions(id, data)

            res.status(200).json(update)
        } catch (error) {
            res.status(400).json({ data: 'Erro ao retornar o usuário!', msg: `Erro: ${error}` })
        }
    }

    public async deleteUser(req: Request, res: Response) {
        try {
            const { id } = req.params

            const deletion = await userService.deleteUser(id)

            res.status(200).json(deletion)
        } catch (error) {
            res.status(400).json({ data: 'Erro ao deletar o usuário!', msg: `Erro: ${error}` })
        }
    }
}

export default new UserController()