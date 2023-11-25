import { collection, getDocs, query } from 'firebase/firestore'
import { DBSource } from '../config/database'
import { Resposta, Usuario } from '../models'
import { db } from '../config/firebase'
import { Repository, createConnection } from 'typeorm'
import * as fs from 'fs'

export class BackupService {
    private repository: Repository<Usuario>
    private repositoryResp: Repository<Resposta>

    constructor() { // inicialização das variáveis objetos dentro da classe
        this.repository = DBSource.getRepository(Usuario)
        this.repositoryResp = DBSource.getRepository(Resposta)
    }

    public async sqlDump() {
        try {
            const path = require('path')
            const file = path.resolve(__dirname, '../../dump-backend.sql')
            let sql = fs.readFileSync(file, 'utf-8')

            await this.deleteUsers()

            console.log('Backup restaurado com sucesso!')
        } catch (error) {
            console.error('Erro ao restaurar o backup:', error)
        } finally {
            if (DBSource) {
                await DBSource.destroy()
            }
        }
    }

    private async getDeletedUsers() {
        let data: number[] = []

        const collect = collection(db, 'deleted')
        const queries = query(collect)
        const getQuery = await getDocs(queries)

        if (!getQuery.empty) {
            getQuery.forEach((qry) => {
                data.push(qry.data().id)
            })
        }

        return data
    }

    private async deleteUsers() {
        try {
            const deleted = []

            const ids = await this.getDeletedUsers()

            for (const id of ids) {
                const deletion = await this.repository.delete(id)

                deleted.push({
                    id,
                    deletion,
                })
            }

            console.log('Usuários deletados com sucesso!')
            return { deleted }
        } catch (error) {
            console.log('Erro ao deletar os usuários: ', error)
        }
    }
}

async function main() {
    const backupService = new BackupService()
    await backupService.sqlDump()
}

DBSource.initialize()
    .then(() => {
        console.log("Banco inicializado com sucesso!");

        main()
    })
    .catch((err: any) => {
        console.error("Erro durante a inicialização do banco: ", err);
    });