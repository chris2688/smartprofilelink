import { Module } from '@nestjs/common';
import { ProposalController } from './proposal.controller';
import { ProposalService } from './proposal.service';
import { PdfService } from './pdf.service';
import { PriceModule } from '../price/price.module';

@Module({
  imports: [PriceModule],
  controllers: [ProposalController],
  providers: [ProposalService, PdfService],
})
export class ProposalModule {}



