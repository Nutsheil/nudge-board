import { NotFoundException } from '@nestjs/common';

import { type PrismaService } from '../prisma/prisma.service';
import { LabelService } from './label.service';

const LABEL_SELECT = { id: true, name: true, color: true };

describe('LabelService', () => {
  const label = {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const prisma = { label } as unknown as PrismaService;
  let service: LabelService;

  beforeEach(() => {
    Object.values(label).forEach((fn) => fn.mockReset());
    service = new LabelService(prisma);
  });

  describe('list', () => {
    it('returns workspace labels ordered by name', async () => {
      const rows = [{ id: 'l1', name: 'Bug', color: 'RED' }];
      label.findMany.mockResolvedValue(rows);

      const result = await service.list('w1');

      expect(label.findMany).toHaveBeenCalledWith({
        where: { workspaceId: 'w1' },
        orderBy: { name: 'asc' },
        select: LABEL_SELECT,
      });
      expect(result).toBe(rows);
    });
  });

  describe('create', () => {
    it('creates a label in the workspace', async () => {
      const created = { id: 'l1', name: 'Bug', color: 'RED' };
      label.create.mockResolvedValue(created);

      const result = await service.create('w1', { name: 'Bug', color: 'RED' as never });

      expect(label.create).toHaveBeenCalledWith({
        data: { workspaceId: 'w1', name: 'Bug', color: 'RED' },
        select: LABEL_SELECT,
      });
      expect(result).toBe(created);
    });
  });

  describe('update', () => {
    it('updates only provided fields after asserting ownership', async () => {
      label.findFirst.mockResolvedValue({ id: 'l1' });
      const updated = { id: 'l1', name: 'Defect', color: 'RED' };
      label.update.mockResolvedValue(updated);

      const result = await service.update('w1', 'l1', { name: 'Defect' });

      expect(label.findFirst).toHaveBeenCalledWith({
        where: { id: 'l1', workspaceId: 'w1' },
        select: { id: true },
      });
      expect(label.update).toHaveBeenCalledWith({
        where: { id: 'l1' },
        data: { name: 'Defect' },
        select: LABEL_SELECT,
      });
      expect(result).toBe(updated);
    });

    it('throws 404 when the label is not in the workspace', async () => {
      label.findFirst.mockResolvedValue(null);

      await expect(service.update('w1', 'l1', { name: 'X' })).rejects.toBeInstanceOf(NotFoundException);
      expect(label.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes after asserting ownership', async () => {
      label.findFirst.mockResolvedValue({ id: 'l1' });

      await service.remove('w1', 'l1');

      expect(label.delete).toHaveBeenCalledWith({ where: { id: 'l1' } });
    });

    it('throws 404 when the label is not in the workspace', async () => {
      label.findFirst.mockResolvedValue(null);

      await expect(service.remove('w1', 'l1')).rejects.toBeInstanceOf(NotFoundException);
      expect(label.delete).not.toHaveBeenCalled();
    });
  });
});
