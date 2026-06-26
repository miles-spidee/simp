import { IDCardAPI } from '../api/idcard.api';
import { DigitalIDCard } from '../types/idcard.types';

export class IDCardService {
  static async getMyIDCard(studentId: string): Promise<DigitalIDCard | null> {
    return IDCardAPI.getMyIDCard(studentId);
  }

  static async verifyIDCard(cardNumber: string): Promise<boolean> {
    const cards = await IDCardAPI.getIDCards();
    const card = cards.find(c => c.cardNumber === cardNumber);
    return card !== undefined && card.status === 'Active' && new Date(card.expiryDate) > new Date();
  }
}
