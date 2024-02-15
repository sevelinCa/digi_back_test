import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
export declare class UserSeedService {
    private repository;
    constructor(repository: Repository<UserEntity>);
    run(): Promise<void>;
}
