import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class ImageResult {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    size: string;

    @Column()
    result: string;

    @Column()
    link: string;
}
