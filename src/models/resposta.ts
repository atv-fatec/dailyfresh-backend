import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./usuario";
import { Termo } from "./termo";

@Entity({ name: 'respostas' })
export class Resposta {
    @PrimaryGeneratedColumn({
        type: 'int'
    })
    id!: number

    @Column({ default: 0 })
    armazenamentoDados!: boolean

    @Column({ default: 0 })
    pagamentoDados!: boolean

    @Column({ default: 0 })
    propagandas!: boolean

    @Column({ default: 0 })
    envioEmail!: boolean

    @Column({ default: 0 })
    envioSms!: boolean

    @ManyToOne(() => Termo, (termo) => termo.resposta)
    termo!: Termo

    @ManyToOne(() => Usuario, (usuario) => usuario.resposta)
    usuario!: Usuario
}