import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  }
})
export class MessagesGateway {
  constructor(private readonly messagesService: MessagesService) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createMessage')
  async create(@MessageBody() createMessageDto: CreateMessageDto, @ConnectedSocket() client: Socket) {
    const message = await this.messagesService.create(createMessageDto, client.id);
    this.server.emit('message', message);
    return message;
  }

  @SubscribeMessage('findAllMessages')
  findAll() {
    const chat = this.messagesService.findAll();
    return chat;
  }

  @SubscribeMessage('join')
  joinRoom(@MessageBody('name') name: string, @ConnectedSocket() client: Socket) {
    return this.messagesService.identify(name, client.id);
  }
} 
