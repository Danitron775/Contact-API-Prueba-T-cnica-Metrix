import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactSubmission } from '../contact-submissions/entities/contact-submission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContactSubmission])],
  controllers: [MetricsController],
  providers: [MetricsService],
})
export class MetricsModule {}