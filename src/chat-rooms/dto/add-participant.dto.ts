import { IsString, IsMongoId } from 'class-validator';

export class AddParticipantDto {
  @IsMongoId()
  @IsString()
  chatRoomId: string;

  @IsString()
  username: string; 
}