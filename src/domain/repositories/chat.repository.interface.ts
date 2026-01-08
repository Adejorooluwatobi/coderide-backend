import { Chat } from "../entities/chat.entity";
import { ChatMessage } from "../entities/chat-message.entity";
import { CreateChatParams, CreateChatMessageParams } from "src/utils/type";

export interface IChatRepository {
    findById(id: string): Promise<Chat | null>;
    findByRideId(rideId: string): Promise<Chat | null>;
    findByParticipants(riderId?: string, driverId?: string, adminId?: string): Promise<Chat | null>;
    create(params: CreateChatParams): Promise<Chat>;
    addMessage(chatId: string, params: CreateChatMessageParams): Promise<ChatMessage>;
    getMessages(chatId: string): Promise<ChatMessage[]>;
    markMessagesAsRead(chatId: string, userId?: string, adminId?: string): Promise<void>;
}
