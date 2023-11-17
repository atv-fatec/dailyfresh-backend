import { IAcceptCondition } from '../interfaces/condicao'
import { ICreateUser } from '../interfaces/usuario'
import userService from '../service/userService'
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

    public async createUser(req: Request, res: Response) {
        try {
            const data: ICreateUser = req.body
            const conditions: IAcceptCondition = req.body.termos
            const obrigatorio: (keyof ICreateUser)[] = [ 'nome', 'email', 'cpf', 'telefone', 'dataNascimento', 'senha' ]
            const validacao = obrigatorio.every(properties => data[properties] !== undefined && data[properties] !== null)

            if (!validacao) {
                return res.status(400).json({
                    data: 'Erro no cadastro do usuário!'
                })
            }

            if (UserController.legalAdult(data.dataNascimento) < 18) {
                return res.status(400).json({
                    data: 'Apenas maiores de idade podem se cadastrar!'
                })
            }            

            const create = await userService.createUser(data, conditions)

            res.status(200).json(create)
        } catch (error) {
            res.status(400).json({ data: '', msg: `Erro: ${error}` })
        }
    }

    public async readUser(req: Request, res: Response) {
        try {
            const { id } = req.params

            const read = await userService.readUser(id)

            res.status(200).json(read)
        } catch (error) {
            res.status(400).json({ data: '', msg: `Erro: ${error}` })
        }
    }
}

export default new UserController()