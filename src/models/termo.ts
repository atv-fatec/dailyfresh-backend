import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Resposta } from "./resposta";

@Entity({ name: 'termos' })
export class Termo {
    @PrimaryGeneratedColumn({
        type: 'int'
    })
    id!: number

    @Column()
    versao!: string

    @Column()
    data!: Date

    @Column({
        type: 'text'
    })
    mensagem!: string

    @OneToMany(() => Resposta, (resposta) => resposta.termo)
    resposta!: Resposta
}