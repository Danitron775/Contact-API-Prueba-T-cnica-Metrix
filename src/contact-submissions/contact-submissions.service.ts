import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactSubmission } from './entities/contact-submission.entity';
import { CreateContactSubmissionDto } from './dto/create-contact-submission.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ContactSubmissionsService {
  constructor(
    @InjectRepository(ContactSubmission)
    private readonly contactRepo: Repository<ContactSubmission>,
    private readonly mailService: MailService,
  ) {}

  async create(dto: CreateContactSubmissionDto): Promise<ContactSubmission> {
    const submission = this.contactRepo.create(dto);
    const saved = await this.contactRepo.save(submission);

    await Promise.all([
      this.mailService.sendUserConfirmation(dto.email, dto.fullName),
      this.mailService.sendAdminNotification(dto),
    ]);

    return saved;
  }
}