import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { timeout } from 'rxjs';
import { ApiService } from '../api.service';

@Injectable()
export class DiscordBotHealthIndicator extends HealthIndicator {
  /**
   *
   */
  constructor(private readonly apiService: ApiService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const isHealthy = await new Promise<boolean>((resolve) => {
      this.apiService
        .ping()
        .pipe(timeout(1000))
        .subscribe({
          next() {
            resolve(true);
          },
          error() {
            resolve(false);
          },
        });
    });

    const result = this.getStatus(key, isHealthy);

    if (this.isHealthy) return result;
    throw new HealthCheckError('Discord Bot health check failed', result);
  }
}
