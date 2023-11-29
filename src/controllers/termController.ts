import { ICreateTerm } from '../interfaces/termo'
import termService from '../service/termService'
import { Request, Response } from 'express'

class TermController {
    public async createTerm(req: Request, res: Response) {
        try {
            const data: ICreateTerm = req.body
            const obrigatorio: (keyof ICreateTerm)[] = [ 'versao', 'mensagem' ]
            const validacao = obrigatorio.every(properties => data[properties] !== undefined && data[properties] !== null)

            if (!validacao) {
                return res.status(400).json({
                    data: 'Erro no cadastro do termo!'
                })
            }

            const create = await termService.createTerm(data)

            res.status(200).json(create)
        } catch (error) {
            console.log(error)
            res.status(400).json({ data: '', msg: `Erro: ${error}` })
        }
    }

    public async readTerm(req: Request, res: Response) {
        try {
            const { id } = req.params

            const read = await termService.readTerm(id)

            res.status(200).json(read)
        } catch (error) {
            res.status(400).json({ data: '', msg: `Erro: ${error}` })
        }
    }

    public async readLatestTerm(req: Request, res: Response) {
        try {
            const latestTermId = await termService.getLatestTerm();
            res.status(200).json({ latestTermId });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default new TermController()