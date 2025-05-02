import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    description: 'The ID of the user to receive the message',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  toId: number;


  @ApiProperty({
    description: 'text message',
    example: 'bu juda yaxshi product ekan',
  })
  @IsString()
  @IsNotEmpty()
  text: string;
}
