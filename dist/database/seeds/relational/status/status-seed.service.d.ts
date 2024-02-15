import { StatusEntity } from 'src/statuses/infrastructure/persistence/relational/entities/status.entity';
import { Repository } from 'typeorm';
export declare class StatusSeedService {
    private repository;
    constructor(repository: Repository<StatusEntity>);
    run(): Promise<void>;
}
