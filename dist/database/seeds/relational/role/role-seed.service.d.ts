import { RoleEntity } from 'src/roles/infrastructure/persistence/relational/entities/role.entity';
import { Repository } from 'typeorm';
export declare class RoleSeedService {
    private repository;
    constructor(repository: Repository<RoleEntity>);
    run(): Promise<void>;
}
