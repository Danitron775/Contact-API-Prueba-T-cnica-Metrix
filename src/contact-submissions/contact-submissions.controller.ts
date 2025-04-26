import {
    Body,
    Controller,
    Post,
    HttpCode,
    HttpStatus,
    UsePipes,
    ValidationPipe,
  } from '@nestjs/common';
  import { ContactSubmissionsService } from './contact-submissions.service';
  import { CreateContactSubmissionDto } from './dto/create-contact-submission.dto';
  
  @Controller('api/contact-submissions')
  export class ContactSubmissionsController {
    constructor(
      private readonly contactSubmissionsService: ContactSubmissionsService,
    ) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async create(@Body() dto: CreateContactSubmissionDto) {
      await this.contactSubmissionsService.create(dto);
  
      return {
        mensaje: 'Formulario recibido correctamente.',
      };
    }
  }
  