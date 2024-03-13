import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@Entity()
export class CustomerManagement {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @ManyToOne(() => UserEntity)
 @JoinColumn({ name: 'userId' })
 userId: UserEntity;

 @IsNotEmpty()
 @IsString()
 @Column({ type: 'text' })
 fullNames: string;
 
 @IsNotEmpty()
 @IsEmail()
 @Column()
 email: string;

 @IsNotEmpty()
 @IsString()
 @Column()
 mobile_number: string;

 @IsNotEmpty()
 @IsString()
 @Column()
 customer_type: string;

 @IsOptional()
 @IsString()
 @Column({ nullable: true })
 company_registration_number?: string;

 @IsOptional()
 @IsString()
 @Column({ nullable: true })
 vat_number?: string;

 @IsNotEmpty()
 @IsString()
 @Column({ type: 'text' })
 address: string;

 @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
 createdAt: Date;

 @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
 updatedAt: Date;

 @Column({ type: 'timestamp', nullable: true })
 deleteAt: Date | null;
}