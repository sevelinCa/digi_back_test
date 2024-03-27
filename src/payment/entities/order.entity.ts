import { DigifranchiseProduct } from 'src/digifranchise/entities/digifranchise-product.entity';
import { DigifranchiseServiceOffered } from 'src/digifranchise/entities/digifranchise-service-offered.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    JoinColumn,
    ManyToOne,
    UpdateDateColumn,
} from 'typeorm';



export enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}
@Entity()
export class OrderTable {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UserEntity, { nullable: true })
    @JoinColumn({ name: 'userId' })
    userId: UserEntity | null;

    @ManyToOne(() => DigifranchiseProduct, { nullable: true })
    @JoinColumn({ name: 'productId' })
    productId: DigifranchiseProduct | null;

    @ManyToOne(() => DigifranchiseServiceOffered, { nullable: true })
    @JoinColumn({ name: 'serviceId' })
    serviceId: DigifranchiseServiceOffered | null;

    @Column({ type: 'integer' })
    quantity: number;

    @Column({ type: 'integer' })
    orderNumber: number;

    @Column({ type: 'varchar', length: 255 })
    unitPrice: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalAmount: number;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    status: OrderStatus;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    OrderDate: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    vatAmount: number | null;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deleteAt: Date | null;
}

@Entity()
export class OrderBasicInfo {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => OrderTable, { nullable: true })
    @JoinColumn({ name: 'orderId' })
    orderId: OrderTable | null;

    @Column({ type: 'text' })
    fullNames: string;

    @Column({ type: 'text' })
    contactDetails: string;

    @Column({ type: 'text' })
    address: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deleteAt: Date | null;
}