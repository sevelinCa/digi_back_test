import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Digifranchise } from "src/digifranchise/entities/digifranchise.entity";
import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
import { Repository, IsNull } from "typeorm";
import { AvailableManagement } from "./entities/available-management.entity";
import { UnavailableManagement } from "./entities/unavailable-management.entity";
import {
  CreateUnavailableManagementDto,
  UpdateUnavailableManagementDto,
} from "./dto/create-unavailable-Management.dto";
import { checkIfUserExists } from "src/helper/FindByFunctions";
import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";

@Injectable()
export class UnavailableManagementService {
  constructor(
    @InjectRepository(UnavailableManagement)
    private readonly unavailableManagementRepository: Repository<UnavailableManagement>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(DigifranchiseOwner)
    private readonly ownedFranchiseRepository: Repository<DigifranchiseOwner>,
    @InjectRepository(AvailableManagement)
    private readonly availableManagementRepository: Repository<AvailableManagement>,
  ) {}

  async createUnavailableManagement(
    userId: string,
    ownedFranchiseId: string,
    createUnavailableManagementDto: CreateUnavailableManagementDto,
  ): Promise<UnavailableManagement> {
    const user = await checkIfUserExists(this.userRepository, userId);
    if (!user) {
      throw new Error("User does not exist");
    }

    const owned = await this.ownedFranchiseRepository.findOne({
      where: { id: ownedFranchiseId },
    });
    if (!owned) {
      throw new Error("owned does not exist");
    }

    const newUnavailableManagement =
      this.unavailableManagementRepository.create({
        ...createUnavailableManagementDto,
        userId: user,
        ownedDigifranchise: owned,
      });

    const savedUnavailableManagement =
      await this.unavailableManagementRepository.save(newUnavailableManagement);
    return savedUnavailableManagement;
  }

  async getAllUnavailableManagement(): Promise<UnavailableManagement[]> {
    return this.unavailableManagementRepository.find({
      where: { deleteAt: IsNull() },
    });
  }

  async getOneUnavailableManagementById(
    id: string,
  ): Promise<UnavailableManagement | null> {
    return this.unavailableManagementRepository.findOne({
      where: { id, deleteAt: IsNull() },
    });
  }

  async updateUnavailableManagement(
    unavailabilityId: string,
    updateUnavailableManagementDto: UpdateUnavailableManagementDto,
  ): Promise<UnavailableManagement> {
    const unavailability = await this.unavailableManagementRepository.findOne({
      where: { id: unavailabilityId, deleteAt: IsNull() },
    });
    if (!unavailability) {
      throw new NotFoundException(
        `availability with ID ${unavailabilityId} not found or has been soft deleted.`,
      );
    }

    this.unavailableManagementRepository.merge(
      unavailability,
      updateUnavailableManagementDto,
    );

    const updatedUnvailability =
      await this.unavailableManagementRepository.save(unavailability);

    return updatedUnvailability;
  }

  async deleteUnavailableManagement(id: string): Promise<void> {
    const unavailableManagement =
      await this.unavailableManagementRepository.findOne({ where: { id } });
    if (!unavailableManagement) {
      throw new NotFoundException(
        `Unavailable Management with ID ${id} not found.`,
      );
    }
    unavailableManagement.deleteAt = new Date();
    await this.unavailableManagementRepository.save(unavailableManagement);
  }
}
