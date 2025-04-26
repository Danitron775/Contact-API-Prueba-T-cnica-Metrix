import { Test, TestingModule } from '@nestjs/testing';
import { ContactSubmissionsController } from './contact-submissions.controller';

describe('ContactSubmissionsController', () => {
  let controller: ContactSubmissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactSubmissionsController],
    }).compile();

    controller = module.get<ContactSubmissionsController>(ContactSubmissionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
