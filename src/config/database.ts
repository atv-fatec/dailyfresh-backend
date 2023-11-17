import { Termo, Usuario, Resposta } from '../models'
import { DataSource } from 'typeorm'
import * as dotenv from 'dotenv'
import 'reflect-metadata'

dotenv.config()

export const DBSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    synchronize: true,
    logging: false,
    entities: [ Termo, Usuario, Resposta ]
})