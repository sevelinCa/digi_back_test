import { OrderTable } from 'src/payment/entities/order.entity';
import {  } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    JoinColumn,
    ManyToOne,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';


@Entity()
export class OrderIssueTable {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => OrderComplaintsTable, complaints => complaints.order)
    complaints: OrderComplaintsTable[]

    @ManyToOne(() => OrderTable, order => order.basicInfos)
    @JoinColumn({ name: 'order' })
    order: OrderTable;

    @Column({ type: 'text' })
    issue_description: string;

    @Column({ type: 'boolean', default: false })
    isSelected: boolean;

    @Column({ type: 'json', nullable: true })
    orderAdditionalInfo: any[];

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deleteAt: Date | null;
}

@Entity()
export class OrderComplaintsTable {
    @PrimaryGeneratedColumn('uuid')
    id: string;

   
    @ManyToOne(() => OrderTable, order => order.basicInfos)
    @JoinColumn({ name: 'order' })
    order: OrderTable;

    @Column({ type: 'json', nullable: true })
    issues: any[];

    @Column({ type: 'text' })
    additional_information:string;

    @Column({ type: 'boolean', default: false })
    refund_requested: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deleteAt: Date | null;
}