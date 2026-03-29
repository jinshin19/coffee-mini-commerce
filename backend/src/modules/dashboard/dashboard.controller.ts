import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '../../common/guards/admin-auth.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  @UseGuards(AdminAuthGuard)
  getOverview() {
    return this.dashboardService.getOverview();
  }
}
