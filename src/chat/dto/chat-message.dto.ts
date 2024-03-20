import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class SendChatMessageDto {
    @ApiProperty({ description: 'Here will be message body', example: 'Good morning!!!' })
    @IsString()
    @IsNotEmpty()
    messageBody: string;
}