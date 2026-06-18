import { NotFoundException } from '@nestjs/common';

import { type PrismaService } from '../prisma/prisma.service';
import { ColumnService } from './column.service';

const SELECT = { id: true, name: true, position: true };

describe('ColumnService', () => {
  const column = {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const board = { findFirst: jest.fn() };
  const $transaction = jest.fn();
  const prisma = { column, board, $transaction } as unknown as PrismaService;
  let service: ColumnService;

  beforeEach(() => {
    [...Object.values(column), board.findFirst, $transaction].forEach((fn) => fn.mockReset());
    service = new ColumnService(prisma);
  });

  describe('create', () => {
    it('appends a column after the last position', async () => {
      board.findFirst.mockResolvedValue({ id: 'b1' });
      column.findFirst.mockResolvedValue({ position: 3 });
      const created = { id: 'c1', name: 'To Do', position: 4 };
      column.create.mockResolvedValue(created);

      const result = await service.create('w1', 'b1', { name: 'To Do' });

      expect(board.findFirst).toHaveBeenCalledWith({ where: { id: 'b1', workspaceId: 'w1' }, select: { id: true } });
      expect(column.create).toHaveBeenCalledWith({
        data: { boardId: 'b1', name: 'To Do', position: 4 },
        select: SELECT,
      });
      expect(result).toBe(created);
    });

    it('uses position 1 for the first column', async () => {
      board.findFirst.mockResolvedValue({ id: 'b1' });
      column.findFirst.mockResolvedValue(null);
      column.create.mockResolvedValue({ id: 'c1', name: 'To Do', position: 1 });

      await service.create('w1', 'b1', { name: 'To Do' });

      expect(column.create).toHaveBeenCalledWith({
        data: { boardId: 'b1', name: 'To Do', position: 1 },
        select: SELECT,
      });
    });

    it('rejects create when the board is not in the workspace', async () => {
      board.findFirst.mockResolvedValue(null);
      await expect(service.create('w1', 'bX', { name: 'X' })).rejects.toBeInstanceOf(NotFoundException);
      expect(column.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('renames after asserting ownership', async () => {
      column.findFirst.mockResolvedValue({ id: 'c1' });
      const updated = { id: 'c1', name: 'Doing', position: 2 };
      column.update.mockResolvedValue(updated);

      const result = await service.update('w1', 'b1', 'c1', { name: 'Doing' });

      expect(column.findFirst).toHaveBeenCalledWith({
        where: { id: 'c1', boardId: 'b1', board: { workspaceId: 'w1' } },
        select: { id: true },
      });
      expect(column.update).toHaveBeenCalledWith({ where: { id: 'c1' }, data: { name: 'Doing' }, select: SELECT });
      expect(result).toBe(updated);
    });

    it('rejects rename of a column outside the board', async () => {
      column.findFirst.mockResolvedValue(null);
      await expect(service.update('w1', 'b1', 'cX', { name: 'X' })).rejects.toBeInstanceOf(NotFoundException);
      expect(column.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes after asserting ownership', async () => {
      column.findFirst.mockResolvedValue({ id: 'c1' });
      column.delete.mockResolvedValue({ id: 'c1' });

      await service.remove('w1', 'b1', 'c1');

      expect(column.findFirst).toHaveBeenCalledWith({
        where: { id: 'c1', boardId: 'b1', board: { workspaceId: 'w1' } },
        select: { id: true },
      });
      expect(column.delete).toHaveBeenCalledWith({ where: { id: 'c1' } });
    });

    it('rejects remove of a column outside the board', async () => {
      column.findFirst.mockResolvedValue(null);
      await expect(service.remove('w1', 'b1', 'cX')).rejects.toBeInstanceOf(NotFoundException);
      expect(column.delete).not.toHaveBeenCalled();
    });
  });

  describe('move', () => {
    const sorted = [
      { id: 'c1', position: 1 },
      { id: 'c2', position: 2 },
      { id: 'c3', position: 3 },
    ];

    it('places between two neighbors at the midpoint', async () => {
      column.findFirst.mockResolvedValue({ id: 'c1' });
      column.findMany.mockResolvedValue(sorted);
      column.update.mockResolvedValue({ id: 'c1', name: 'A', position: 2.5 });

      const result = await service.move('w1', 'b1', 'c1', { afterId: 'c2' });

      expect(column.update).toHaveBeenCalledWith({ where: { id: 'c1' }, data: { position: 2.5 }, select: SELECT });
      expect(result).toEqual({ id: 'c1', name: 'A', position: 2.5 });
    });

    it('moves to the first slot using neighbor minus one', async () => {
      column.findFirst.mockResolvedValue({ id: 'c3' });
      column.findMany.mockResolvedValue(sorted);
      column.update.mockResolvedValue({ id: 'c3', name: 'C', position: 0 });

      await service.move('w1', 'b1', 'c3', { afterId: null });

      // others = [c1(1), c2(2)] -> next = c1(1) -> position = 1 - 1 = 0
      expect(column.update).toHaveBeenCalledWith({ where: { id: 'c3' }, data: { position: 0 }, select: SELECT });
    });

    it('moves to the last slot using neighbor plus one', async () => {
      column.findFirst.mockResolvedValue({ id: 'c1' });
      column.findMany.mockResolvedValue(sorted);
      column.update.mockResolvedValue({ id: 'c1', name: 'A', position: 4 });

      await service.move('w1', 'b1', 'c1', { afterId: 'c3' });

      // others = [c2(2), c3(3)] -> prev = c3(3) -> position = 3 + 1 = 4
      expect(column.update).toHaveBeenCalledWith({ where: { id: 'c1' }, data: { position: 4 }, select: SELECT });
    });

    it('rebalances in a transaction when the neighbor gap collapses', async () => {
      column.findFirst.mockResolvedValue({ id: 'c3' });
      column.findMany.mockResolvedValue([
        { id: 'c1', position: 1 },
        { id: 'c2', position: 1.0000001 },
        { id: 'c3', position: 5 },
      ]);
      $transaction.mockResolvedValue([
        { id: 'c1', name: 'A', position: 1 },
        { id: 'c3', name: 'C', position: 2 },
        { id: 'c2', name: 'B', position: 3 },
      ]);

      const result = await service.move('w1', 'b1', 'c3', { afterId: 'c1' });

      // others = [c1, c2]; insert c3 after c1 -> ordered [c1, c3, c2] -> positions 1,2,3
      expect(column.update).toHaveBeenNthCalledWith(1, { where: { id: 'c1' }, data: { position: 1 }, select: SELECT });
      expect(column.update).toHaveBeenNthCalledWith(2, { where: { id: 'c3' }, data: { position: 2 }, select: SELECT });
      expect(column.update).toHaveBeenNthCalledWith(3, { where: { id: 'c2' }, data: { position: 3 }, select: SELECT });
      expect($transaction).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ id: 'c3', name: 'C', position: 2 });
    });

    it('rejects move when the anchor column is not in the board', async () => {
      column.findFirst.mockResolvedValue({ id: 'c1' });
      column.findMany.mockResolvedValue(sorted);
      await expect(service.move('w1', 'b1', 'c1', { afterId: 'cX' })).rejects.toBeInstanceOf(NotFoundException);
    });

    it('rejects move of a column outside the board', async () => {
      column.findFirst.mockResolvedValue(null);
      await expect(service.move('w1', 'b1', 'cX', { afterId: null })).rejects.toBeInstanceOf(NotFoundException);
      expect(column.findMany).not.toHaveBeenCalled();
    });
  });
});
