import { Repository } from "typeorm";
import { OrderTable } from "src/payment/entities/order.entity";
import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";

export async function getOrderUserNamesAndEmailWithOwnerEmail(
  orderRepository: Repository<OrderTable>,
  digifranchiseOwnerRepository: Repository<DigifranchiseOwner>,
  orderId: string
): Promise<{
  email: string;
  name: string;
  digifranchiseOwnerId: string;
  ownerEmail: string;
} | null> {
  const order = await orderRepository.findOne({
    where: { id: orderId },
    relations: ['userId', 'ownedDigifranchise']
  });

  if (!order) {
    return null;
  }

  const userInfo = order.orderAdditionalInfo.find(info => info.basic_info);
  
  if (!userInfo || !userInfo.basic_info) {
    return null;
  }

  const digifranchiseOwnerId = order.ownedDigifranchise!.id;

  try {
    const ownerEmail = await getEmailByDigifranchiseOwnerId(digifranchiseOwnerRepository, digifranchiseOwnerId);

    return {
      email: userInfo.basic_info.email,
      name: userInfo.basic_info.name,
      digifranchiseOwnerId: digifranchiseOwnerId,
      ownerEmail: ownerEmail
    };
  } catch (error) {
    console.error(`Error getting owner email: ${error.message}`);
    return null;
  }
}

async function getEmailByDigifranchiseOwnerId(
  digifranchiseOwnerRepository: Repository<DigifranchiseOwner>,
  digifranchiseOwnerId: string
): Promise<string> {
  const owner = await digifranchiseOwnerRepository.findOne({
    where: { id: digifranchiseOwnerId },  
    select: ['userEmail'],  
  });

  if (!owner) {
    throw new Error(`No owner found with ID: ${digifranchiseOwnerId}`);
  }

  return owner.userEmail;
}