import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactSubmission } from '../contact-submissions/entities/contact-submission.entity';
import { Between } from 'typeorm';

@Injectable()
export class MetricsService {
  constructor(
    @InjectRepository(ContactSubmission)
    private readonly contactRepo: Repository<ContactSubmission>,
  ) {}

  async countTodaySubmissions(): Promise<number> {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0, 0, 0,
    );

    return this.contactRepo.count({
      where: {
        createdAt: Between(startOfDay, now),
      },
    });
  }

  async getSubmissionsByCountry(): Promise<{ country: string; count: number }[]> {
    return this.contactRepo
      .createQueryBuilder('submission')
      .select('submission.country', 'country')
      .addSelect('COUNT(*)', 'count')
      .where('submission.country IS NOT NULL AND submission.country != \'\'')
      .groupBy('submission.country')
      .orderBy('count', 'DESC')
      .getRawMany();
  }
}
