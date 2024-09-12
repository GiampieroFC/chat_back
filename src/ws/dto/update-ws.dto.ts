import { PartialType } from '@nestjs/mapped-types';
import { CreateWsDto } from './create-ws.dto';

export class UpdateWsDto extends PartialType(CreateWsDto) {
  id: number;
}
