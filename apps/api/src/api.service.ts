import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { BotService } from './bot-service.interface';

@Injectable()
export class ApiService implements OnModuleInit {
  private botService: BotService;

  /**
   *
   */
  constructor(@Inject('BOT_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.botService = this.client.getService<BotService>('BotService');
  }

  ping(id = 1): Observable<{ id: number }> {
    return this.botService.ping({ id });
  }
}
