import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsArray } from "class-validator";

export class CreateOrderIssueDto {
    @ApiProperty({ example: 'Order issue description' })
    @IsNotEmpty()
    @IsString()
    issue_description: string;

    @ApiProperty({ example: false })
    @IsOptional()
    @IsBoolean()
    isSelected?: boolean;
}

export class UpdateOrderIssueDto {
    @ApiProperty({ example: 'Updated order issue description', required: false })
    @IsOptional()
    @IsString()
    issue_description?: string;

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    @IsBoolean()
    isSelected?: boolean;
}


export class CreateOrderComplaintsDto {
    @ApiProperty({
        example: [
            { "Name": "This is the issue 1" },
            { "Name": "This is the issue 2" },
        ],
        type: () => [Object]
    })
    @IsArray()
    @IsOptional()
    issues: any[];

    @ApiProperty({ example: 'Additional information about the complaint' })
    @IsString()
    @IsOptional()
    additional_information: string;

    @ApiProperty({ example: true })
    @IsBoolean()
    @IsOptional()
    refund_requested: boolean;
}


export class UpdateOrderComplaintsDto {
    @ApiProperty({
        example: [
            { "Name": "This is the updated issue 1" },
            { "Name": "This is the updated issue 2" },
        ],
        type: () => [Object]
    })
    @IsArray()
    @IsOptional()
    issues: any[];

    @ApiProperty({ example: 'Updated additional information about the complaint', required: false })
    @IsString()
    @IsOptional()
    additional_information?: string;

    @ApiProperty({ example: false, required: false })
    @IsBoolean()
    @IsOptional()
    refund_requested?: boolean;
}