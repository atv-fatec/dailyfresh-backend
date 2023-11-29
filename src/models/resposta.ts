import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./usuario";
import { Termo } from "./termo";

@Entity({ name: 'respostas' })
export class Resposta {
    @PrimaryGeneratedColumn({
        type: 'int'
    })
    id!: number

    @Column()
    armazenamentoDados!: boolean

    @Column()
    pagamentoDados!: boolean

    @Column()
    propagandas!: boolean

    @Column()
    envioEmail!: boolean

    @Column()
    envioSms!: boolean

    @Column()
    data!: Date

    @ManyToOne(() => Termo, (termo) => termo.resposta)
    termo!: Termo

    @ManyToOne(() => Usuario, (usuario) => usuario.resposta, { onDelete: "CASCADE"})
    usuario!: Usuario
}