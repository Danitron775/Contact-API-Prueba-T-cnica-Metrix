import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { CreateContactSubmissionDto } from '../contact-submissions/dto/create-contact-submission.dto';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendUserConfirmation(email: string, fullName: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"Consultores Estratégicos" <${this.configService.get<string>('EMAIL_USER')}>`,
      to: email,
      subject: 'Confirmación de envío de formulario',
      text: `Hola ${fullName},\n\nGracias por contactarnos. Hemos recibido tu mensaje y nos pondremos en contacto contigo pronto.\n\nSaludos,\nConsultores Estratégicos Ltda.`,
    });
  }

  async sendAdminNotification(dto: CreateContactSubmissionDto): Promise<void> {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');

    const content = `
      Nuevo formulario de contacto recibido:
      
      Nombre completo: ${dto.fullName}
      Email: ${dto.email}
      País: ${dto.country ?? 'No especificado'}
      Teléfono: ${dto.phone ?? 'No especificado'}
      Mensaje: ${dto.message}
    `;

    await this.transporter.sendMail({
      from: `"Formulario Web" <${this.configService.get<string>('EMAIL_USER')}>`,
      to: adminEmail,
      subject: 'Nuevo formulario de contacto recibido',
      text: content,
    });
  }
}