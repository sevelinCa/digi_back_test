// In TrialFuncController

import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TrialFuncService } from './trial-func.service'; 
import { DigifranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity'; // Correct import

@ApiTags('SAMPLE')
@Controller({ path: 'trial-func', version: '1' })
export class TrialFuncController {
    constructor(private readonly trialFuncService: TrialFuncService) {}

    // @Get(':digifranchiseId')
    // async getServicesAndSubServicesByDigifranchiseId(@Param('digifranchiseId') digifranchiseId: string): Promise<{ digifranchiseOwnerId: string | null, digifranchiseId: string | null }> {
    //     try {
    //         const result = await this.trialFuncService.getServicesAndSubServicesByDigifranchiseId(digifranchiseId);
    //         return result;
    //     } catch (error) {
    //         throw new Error(error.message); // Or handle the error as per your application logic
    //     }
    // }
}