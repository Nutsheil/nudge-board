import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import type { CreateLabelDto } from './dto/create-label.dto';
import type { LabelDto } from './dto/label.dto';
import type { UpdateLabelDto } from './dto/update-label.dto';

const LABEL_SELECT = { id: true, name: true, color: true } as const;

@Injectable()
export class LabelService {
  constructor(private readonly prisma: PrismaService) {}

  list(workspaceId: string): Promise<LabelDto[]> {
    return this.prisma.label.findMany({
      where: { workspaceId },
      orderBy: { name: 'asc' },
      select: LABEL_SELECT,
    });
  }

  create(workspaceId: string, dto: CreateLabelDto): Promise<LabelDto> {
    return this.prisma.label.create({
      data: { workspaceId, name: dto.name, color: dto.color },
      select: LABEL_SELECT,
    });
  }

  async update(workspaceId: string, labelId: string, dto: UpdateLabelDto): Promise<LabelDto> {
    await this.assertLabelInWorkspace(workspaceId, labelId);

    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.color !== undefined) data.color = dto.color;

    return this.prisma.label.update({
      where: { id: labelId },
      data,
      select: LABEL_SELECT,
    });
  }

  async remove(workspaceId: string, labelId: string): Promise<void> {
    await this.assertLabelInWorkspace(workspaceId, labelId);
    await this.prisma.label.delete({ where: { id: labelId } });
  }

  private async assertLabelInWorkspace(workspaceId: string, labelId: string): Promise<void> {
    const label = await this.prisma.label.findFirst({
      where: { id: labelId, workspaceId },
      select: { id: true },
    });
    if (!label) {
      throw new NotFoundException('Label not found');
    }
  }
}
