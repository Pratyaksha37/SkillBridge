import { messageRepository } from '../repositories/messageRepository';

export class MessageService {
  async sendMessage(data: { content: string; senderId: string; sessionId: string }) {
    return messageRepository.create(data);
  }

  async getMessages(sessionId: string) {
    return messageRepository.findBySession(sessionId);
  }
}

export const messageService = new MessageService();
