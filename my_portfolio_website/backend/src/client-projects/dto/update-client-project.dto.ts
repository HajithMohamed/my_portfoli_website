import { PartialType } from '@nestjs/swagger';
import { CreateClientProjectDto } from './create-client-project.dto';

export class UpdateClientProjectDto extends PartialType(CreateClientProjectDto) {}
