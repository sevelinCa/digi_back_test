import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsBoolean } from "class-validator";

export class CreateOrderIssueTable {
    @ApiProperty({ example: 'Order issue description' })
    @IsNotEmpty()
    @IsString()
    issue_description: string;

    @ApiProperty({ example: false })
    @IsOptional()
    @IsBoolean()
    isSelected?: boolean;
}

export class UpdateOrderIssueTable {
    @ApiProperty({ example: 'Updated order issue description', required: false })
    @IsOptional()
    @IsString()
    issue_description?: string;

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    @IsBoolean()
    isSelected?: boolean;
}

export class CreateOrderComplaintsTable {
    @ApiProperty({ example: 'Custom issue description' })
    @IsNotEmpty()
    @IsString()
    custom_issue_description: string;

    @ApiProperty({ example: 'Additional information' })
    @IsNotEmpty()
    @IsString()
    additional_information: string;

    @ApiProperty({ example: true })
    @IsOptional()
    @IsBoolean()
    refund_requested?: boolean;
}


export class UpdateOrderComplaintsTable {
    @ApiProperty({ example: 'Updated custom issue description', required: false })
    @IsOptional()
    @IsString()
    custom_issue_description?: string;

    @ApiProperty({ example: 'Updated additional information', required: false })
    @IsOptional()
    @IsString()
    additional_information?: string;

    @ApiProperty({ example: false, required: false })
    @IsOptional()
    @IsBoolean()
    refund_requested?: boolean;
}