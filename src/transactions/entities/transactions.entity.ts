// import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToOne, JoinTable, ManyToMany } from 'typeorm';

// @Entity('transactions')
// export class Transaction {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column()
//   title: string;

//   @Column()
//   description: string;

//   @Column()
//   industry: string;

//   @Column()
//   currency: string;

//   @Column()
//   feeAllocation: string;

//   @ManyToMany(() => Allocation, allocation => allocation.transactions)
//   allocations: Allocation[];

//   @OneToMany(() => Party, party => party.transactions, { cascade: true })
//   parties: Party[];
// }

// @Entity('allocations')
// export class Allocation {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column()
//   title: string;

//   @Column()
//   description: string;

//   @Column()
//   value: number;

//   @Column()
//   daysToDeliver: number;

//   @Column()
//   daysToInspect: number;

//   @ManyToMany(() => Transaction, transaction => transaction.allocations)
//   @JoinTable()
//   transactions: Transaction[];
// }

// @Entity('parties')
// export class Party {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column()
//   token: string;

//   @Column()
//   role: string;

//   @ManyToMany(() => Transaction, transaction => transaction.parties)
//   @JoinTable()
//   transactions: Transaction[];
// }
