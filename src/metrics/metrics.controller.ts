import { Controller, Get } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller('api/metrics')
export class MetricsController {
    constructor(private readonly metricsService: MetricsService) { }

    @Get('daily-submissions')
    async getDailySubmissions() {
        const count = await this.metricsService.countTodaySubmissions();
        return { conteo: count };
    }

    @Get('submissions-by-country')
    async getSubmissionsByCountry() {
        const data = await this.metricsService.getSubmissionsByCountry();
        return data.map(item => ({
            pais: item.country,
            conteo: Number(item.count),
        }));
    }

}