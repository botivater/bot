import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { ApiService } from '../api.service';

@Injectable()
export class DiscordBotHealthIndicator extends HealthIndicator {
  /**
   *
   */
  constructor(private apiService: ApiService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    let isHealthy = false;
    try {
      isHealthy = await new Promise<boolean>((resolve) => {
        // Commented out due to bug in GRPCjs
        // when connection fails the whole process crashes
        // even when wrapping in a try/catch
        // this.apiService.ping().subscribe(() => resolve(true));
        setTimeout(() => resolve(false), 5000);
      });
    } catch (err) {
      console.error(err);
    }

    const result = this.getStatus(key, isHealthy);

    if (isHealthy) return result;
    throw new HealthCheckError('Discord Bot health check failed', result);
  }
}
