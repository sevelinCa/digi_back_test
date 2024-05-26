import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Equal, IsNull, Not, Repository } from "typeorm";
import {
  CreateAvailabilityManagementDto,
  type UpdateAvailabilityManagementDto,
} from "./dto/create-availability-management.dto";
import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
import { checkIfUserExists } from "src/helper/FindByFunctions";
import { AvailableManagement } from "./entities/available-management.entity";
import { Digifranchise } from "src/digifranchise/entities/digifranchise.entity";
import { CreateUnavailableManagementDto } from "./dto/create-unavailable-Management.dto";
import { UnavailableManagementService } from "./unavailability-management.service";
import { UnavailableManagement } from "./entities/unavailable-management.entity";
import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";

@Injectable()
export class AvailabilityManagementService {
  constructor(
    @InjectRepository(AvailableManagement)
    private readonly availabilityRepository: Repository<AvailableManagement>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(DigifranchiseOwner)
    private readonly digifranchiseOwnerRepository: Repository<DigifranchiseOwner>,
    @InjectRepository(UnavailableManagement)
    private readonly unavailableManagementRepository: Repository<UnavailableManagement>,
  ) {}

  async createAvailability(
    userId: string,
    ownedFranchiseId: string,
    createAvailabilityManagementDto: CreateAvailabilityManagementDto,
  ): Promise<AvailableManagement> {
    const user = await checkIfUserExists(this.userRepository, userId);
    if (!user) {
      throw new Error("User does not exist");
    }

    const owned = await this.digifranchiseOwnerRepository.findOne({
      where: { id: ownedFranchiseId },
    });
    if (!owned) {
      throw new Error("owned does not exist");
    }

    const newAvailability = this.availabilityRepository.create({
      ...createAvailabilityManagementDto,
      userId: user,
      ownedDigifranchise: owned,
    });

    const savedAvailability =
      await this.availabilityRepository.save(newAvailability);

    const newUnavailableManagement =
      this.unavailableManagementRepository.create({
        userId: user,
        ownedDigifranchise: owned,
        AvailableManagementId: savedAvailability,
        unavailableTime: createAvailabilityManagementDto.unavailableTime,
      });

    await this.unavailableManagementRepository.save(newUnavailableManagement);

    return savedAvailability;
  }

  async createAvailabilityNoAuth(
    ownedFranchiseId: string,
    createAvailabilityManagementDto: CreateAvailabilityManagementDto,
  ): Promise<AvailableManagement> {
    const Owned = await this.digifranchiseOwnerRepository.findOne({
      where: { id: ownedFranchiseId },
    });
    if (!Owned) {
      throw new Error("Owned does not exist");
    }

    const newAvailability = this.availabilityRepository.create({
      ...createAvailabilityManagementDto,
      ownedDigifranchise: Owned,
    });

    const savedAvailability =
      await this.availabilityRepository.save(newAvailability);

    const newUnavailableManagement =
      this.unavailableManagementRepository.create({
        ownedDigifranchise: Owned,
        AvailableManagementId: savedAvailability,
        unavailableTime: createAvailabilityManagementDto.unavailableTime,
      });

    await this.unavailableManagementRepository.save(newUnavailableManagement);

    return savedAvailability;
  }

  async getAllAvailabilityNotAuth(): Promise<AvailableManagement[]> {
    return this.availabilityRepository.find({ where: { deleteAt: IsNull() } });
  }

  async getAllAvailability(userId: string): Promise<AvailableManagement[]> {
    return this.availabilityRepository.find({
      where: { userId: Equal(userId), deleteAt: IsNull() },
    });
  }

  async getAllAvailabilityByOwned(
    ownedFranchiseId: string,
  ): Promise<AvailableManagement[]> {
    const owned = await this.digifranchiseOwnerRepository.findOne({
      where: { id: ownedFranchiseId },
    });
    if (!owned) {
      throw new Error("owned does not exist");
    }

    return this.availabilityRepository.find({
      where: {
        ownedDigifranchise: Equal(owned.id),
        deleteAt: IsNull(),
      },
    });
  }

  async getOneAvailabiltyById(
    availabilityId: string,
  ): Promise<AvailableManagement | null> {
    return this.availabilityRepository.findOne({
      where: { id: availabilityId, deleteAt: IsNull() },
    });
  }

  async updateAvailability(
    availabilityId: string,
    updateAvailabilityManagementDto: UpdateAvailabilityManagementDto,
  ): Promise<AvailableManagement> {
    const availability = await this.availabilityRepository.findOne({
      where: { id: availabilityId, deleteAt: IsNull() },
    });
    if (!availability) {
      throw new NotFoundException(
        `availability with ID ${availabilityId} not found or has been soft deleted.`,
      );
    }

    this.availabilityRepository.merge(
      availability,
      updateAvailabilityManagementDto,
    );

    const updatedAvailability =
      await this.availabilityRepository.save(availability);

    return updatedAvailability;
  }

  async deleteAvailability(availabilityId: string): Promise<void> {
    const availability = await this.availabilityRepository.findOne({
      where: { id: availabilityId },
    });
    if (!availability) {
      throw new NotFoundException(
        `availability with ID ${availabilityId} not found.`,
      );
    }
    availability.deleteAt = new Date();
    await this.availabilityRepository.save(availability);
  }
}
