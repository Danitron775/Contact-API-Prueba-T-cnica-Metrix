import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactSubmissionsController } from './contact-submissions.controller';
import { ContactSubmissionsService } from './contact-submissions.service';
import { ContactSubmission } from './entities/contact-submission.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([ContactSubmission]), MailModule,],
  controllers: [ContactSubmissionsController],
  providers: [ContactSubmissionsService],
})
export class ContactSubmissionsModule {}