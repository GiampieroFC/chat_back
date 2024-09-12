import { Injectable } from '@nestjs/common';
import { CreateWsDto } from './dto/create-ws.dto';
import { UpdateWsDto } from './dto/update-ws.dto';

@Injectable()
export class WsService {
  create(createWDto: CreateWsDto) {
    return 'This action adds a new w';
  }

  findAll() {
    return `This action returns all ws`;
  }

  findOne(id: number) {
    return `This action returns a #${id} w`;
  }

  update(id: number, updateWDto: UpdateWsDto) {
    return `This action updates a #${id} w`;
  }

  remove(id: number) {
    return `This action removes a #${id} w`;
  }
}
