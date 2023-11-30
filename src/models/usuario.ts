import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Resposta } from "./resposta";

@Entity({ name: 'usuarios' })
export class Usuario {
    @PrimaryGeneratedColumn({
        type: 'int'
    })
    id!: number

    @Column()
    nome!: string

    @Column()
    email!: string

    @Column()
    cpf!: string

    @Column()
    telefone!: string

    @Column()
    dataNascimento!: Date

    @Column()
    senha!: string

    @OneToMany(() => Resposta, (resposta) => resposta.usuario, { onDelete: "CASCADE" })
    resposta!: Resposta[]
}