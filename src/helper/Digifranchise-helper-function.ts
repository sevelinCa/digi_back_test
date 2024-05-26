import { Equal, Repository } from "typeorm";
import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";

export async function findOwnedDigifranchiseIdByDigifranchiseId(
  digifranchiseOwnerRepository: Repository<DigifranchiseOwner>,
  digifranchiseId: string,
): Promise<string | null> {
  const digifranchiseOwner = await digifranchiseOwnerRepository.findOne({
    where: { digifranchiseId: Equal(digifranchiseId) },
  });
  return digifranchiseOwner ? digifranchiseOwner.id : null;
}

export async function findDigifranchiseIdByDigifranchiseOwnerId(
  digifranchiseOwnerRepository: Repository<DigifranchiseOwner>,
  digifranchiseOwnerId: string,
): Promise<string | null> {
  const digifranchiseOwner = await digifranchiseOwnerRepository.findOne({
    where: { id: Equal(digifranchiseOwnerId) },
  });
  return digifranchiseOwner ? digifranchiseOwner.digifranchiseId : null;
}
