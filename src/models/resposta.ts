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
    data!: Date

    @Column({ type: 'text' })
    obrigatorios!: string

    @Column({ type: 'text' })
    condicoes!: string

    @Column({ type: 'text' })
    meios!: string

    @ManyToOne(() => Termo, (termo) => termo.resposta)
    termo!: Termo

    @ManyToOne(() => Usuario, (usuario) => usuario.resposta, { onDelete: "CASCADE"})
    usuario!: Usuario
}