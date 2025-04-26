import { Test, TestingModule } from '@nestjs/testing';
import { ContactSubmissionsService } from './contact-submissions.service';

describe('ContactSubmissionsService', () => {
  let service: ContactSubmissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactSubmissionsService],
    }).compile();

    service = module.get<ContactSubmissionsService>(ContactSubmissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
