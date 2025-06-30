import { Body, Controller, Get, Param, Post, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { AuthGuard } from '../auth/auth.guard';
import { Workspace, WorkspaceInsert, WorkspaceUpdate } from '@auto-note-workspace/shared';

@UseGuards(AuthGuard)
@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  async create(@Body() body: WorkspaceInsert, @Request() req): Promise<Workspace> {
    const data = { ...body, owner_id: req.user.id };
    return this.workspaceService.create(data);
  }

  @Get()
  async findAll(@Request() req): Promise<Workspace[]> {
    return this.workspaceService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Workspace> {
    return this.workspaceService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: WorkspaceUpdate): Promise<Workspace> {
    return this.workspaceService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req): Promise<Workspace> {
    return this.workspaceService.remove(id, req.user.id);
  }

  @Post(':id/activate')
  async activate(@Param('id') id: string, @Request() req): Promise<Workspace> {
    return this.workspaceService.activate(id, req.user.id);
  }
} 