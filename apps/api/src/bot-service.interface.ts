import { Observable } from 'rxjs';

export interface BotService {
  ping(data: { id: number }): Observable<{ id: number }>;
}
