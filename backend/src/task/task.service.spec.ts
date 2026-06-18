import { NotFoundException } from '@nestjs/common';

import { type PrismaService } from '../prisma/prisma.service';
import { TaskService } from './task.service';

const SELECT = { id: true, columnId: true, title: true, position: true };

describe('TaskService', () => {
  const task = {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const column = { findFirst: jest.fn() };
  const $transaction = jest.fn();
  const prisma = { task, column, $transaction } as unknown as PrismaService;
  let service: TaskService;

  beforeEach(() => {
    [...Object.values(task), column.findFirst, $transaction].forEach((fn) => fn.mockReset());
    service = new TaskService(prisma);
  });

  describe('create', () => {
    it('appends a task after the last position in the column', async () => {
      column.findFirst.mockResolvedValue({ id: 'col1' });
      task.findFirst.mockResolvedValue({ position: 3 });
      const created = { id: 't1', columnId: 'col1', title: 'Write spec', position: 4 };
      task.create.mockResolvedValue(created);

      const result = await service.create('w1', 'b1', 'col1', { title: 'Write spec' });

      expect(column.findFirst).toHaveBeenCalledWith({
        where: { id: 'col1', boardId: 'b1', board: { workspaceId: 'w1' } },
        select: { id: true },
      });
      expect(task.create).toHaveBeenCalledWith({
        data: { columnId: 'col1', title: 'Write spec', position: 4 },
        select: SELECT,
      });
      expect(result).toBe(created);
    });

    it('uses position 1 for the first task in the column', async () => {
      column.findFirst.mockResolvedValue({ id: 'col1' });
      task.findFirst.mockResolvedValue(null);
      task.create.mockResolvedValue({ id: 't1', columnId: 'col1', title: 'X', position: 1 });

      await service.create('w1', 'b1', 'col1', { title: 'X' });

      expect(task.create).toHaveBeenCalledWith({
        data: { columnId: 'col1', title: 'X', position: 1 },
        select: SELECT,
      });
    });

    it('rejects create when the column is not in the board', async () => {
      column.findFirst.mockResolvedValue(null);
      await expect(service.create('w1', 'b1', 'colX', { title: 'X' })).rejects.toBeInstanceOf(NotFoundException);
      expect(task.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('renames after asserting ownership', async () => {
      task.findFirst.mockResolvedValue({ id: 't1' });
      const updated = { id: 't1', columnId: 'col1', title: 'Renamed', position: 2 };
      task.update.mockResolvedValue(updated);

      const result = await service.update('w1', 'b1', 't1', { title: 'Renamed' });

      expect(task.findFirst).toHaveBeenCalledWith({
        where: { id: 't1', column: { boardId: 'b1', board: { workspaceId: 'w1' } } },
        select: { id: true },
      });
      expect(task.update).toHaveBeenCalledWith({ where: { id: 't1' }, data: { title: 'Renamed' }, select: SELECT });
      expect(result).toBe(updated);
    });

    it('rejects rename of a task outside the board', async () => {
      task.findFirst.mockResolvedValue(null);
      await expect(service.update('w1', 'b1', 'tX', { title: 'X' })).rejects.toBeInstanceOf(NotFoundException);
      expect(task.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes after asserting ownership', async () => {
      task.findFirst.mockResolvedValue({ id: 't1' });
      task.delete.mockResolvedValue({ id: 't1' });

      await service.remove('w1', 'b1', 't1');

      expect(task.findFirst).toHaveBeenCalledWith({
        where: { id: 't1', column: { boardId: 'b1', board: { workspaceId: 'w1' } } },
        select: { id: true },
      });
      expect(task.delete).toHaveBeenCalledWith({ where: { id: 't1' } });
    });

    it('rejects remove of a task outside the board', async () => {
      task.findFirst.mockResolvedValue(null);
      await expect(service.remove('w1', 'b1', 'tX')).rejects.toBeInstanceOf(NotFoundException);
      expect(task.delete).not.toHaveBeenCalled();
    });
  });

  describe('move', () => {
    const col1 = [
      { id: 't1', position: 1 },
      { id: 't2', position: 2 },
      { id: 't3', position: 3 },
    ];

    it('places between two neighbors in the same column at the midpoint', async () => {
      task.findFirst.mockResolvedValue({ id: 't1' });
      column.findFirst.mockResolvedValue({ id: 'col1' });
      task.findMany.mockResolvedValue(col1);
      task.update.mockResolvedValue({ id: 't1', columnId: 'col1', title: 'A', position: 2.5 });

      const result = await service.move('w1', 'b1', 't1', { targetColumnId: 'col1', afterId: 't2' });

      expect(task.findMany).toHaveBeenCalledWith({
        where: { columnId: 'col1' },
        orderBy: { position: 'asc' },
        select: { id: true, position: true },
      });
      // others = [t2(2), t3(3)] -> after t2 -> midpoint(2, 3) = 2.5
      expect(task.update).toHaveBeenCalledWith({
        where: { id: 't1' },
        data: { columnId: 'col1', position: 2.5 },
        select: SELECT,
      });
      expect(result).toEqual({ id: 't1', columnId: 'col1', title: 'A', position: 2.5 });
    });

    it('moves to the first slot using neighbor minus one', async () => {
      task.findFirst.mockResolvedValue({ id: 't3' });
      column.findFirst.mockResolvedValue({ id: 'col1' });
      task.findMany.mockResolvedValue(col1);
      task.update.mockResolvedValue({ id: 't3', columnId: 'col1', title: 'C', position: 0 });

      await service.move('w1', 'b1', 't3', { targetColumnId: 'col1', afterId: null });

      // others = [t1(1), t2(2)] -> next = t1(1) -> 1 - 1 = 0
      expect(task.update).toHaveBeenCalledWith({
        where: { id: 't3' },
        data: { columnId: 'col1', position: 0 },
        select: SELECT,
      });
    });

    it('moves to the last slot using neighbor plus one', async () => {
      task.findFirst.mockResolvedValue({ id: 't1' });
      column.findFirst.mockResolvedValue({ id: 'col1' });
      task.findMany.mockResolvedValue(col1);
      task.update.mockResolvedValue({ id: 't1', columnId: 'col1', title: 'A', position: 4 });

      await service.move('w1', 'b1', 't1', { targetColumnId: 'col1', afterId: 't3' });

      // others = [t2(2), t3(3)] -> prev = t3(3) -> 3 + 1 = 4
      expect(task.update).toHaveBeenCalledWith({
        where: { id: 't1' },
        data: { columnId: 'col1', position: 4 },
        select: SELECT,
      });
    });

    it('moves a task into a different column and sets its columnId', async () => {
      task.findFirst.mockResolvedValue({ id: 't1' });
      column.findFirst.mockResolvedValue({ id: 'col2' });
      task.findMany.mockResolvedValue([{ id: 't9', position: 5 }]); // col2's tasks
      task.update.mockResolvedValue({ id: 't1', columnId: 'col2', title: 'A', position: 6 });

      const result = await service.move('w1', 'b1', 't1', { targetColumnId: 'col2', afterId: 't9' });

      expect(column.findFirst).toHaveBeenCalledWith({
        where: { id: 'col2', boardId: 'b1', board: { workspaceId: 'w1' } },
        select: { id: true },
      });
      expect(task.findMany).toHaveBeenCalledWith({
        where: { columnId: 'col2' },
        orderBy: { position: 'asc' },
        select: { id: true, position: true },
      });
      // others = [t9(5)] -> prev = t9(5), no next -> 6
      expect(task.update).toHaveBeenCalledWith({
        where: { id: 't1' },
        data: { columnId: 'col2', position: 6 },
        select: SELECT,
      });
      expect(result).toEqual({ id: 't1', columnId: 'col2', title: 'A', position: 6 });
    });

    it('moves a task into an empty column at position 0', async () => {
      task.findFirst.mockResolvedValue({ id: 't1' });
      column.findFirst.mockResolvedValue({ id: 'col2' });
      task.findMany.mockResolvedValue([]); // empty target column
      task.update.mockResolvedValue({ id: 't1', columnId: 'col2', title: 'A', position: 0 });

      await service.move('w1', 'b1', 't1', { targetColumnId: 'col2', afterId: null });

      expect(task.update).toHaveBeenCalledWith({
        where: { id: 't1' },
        data: { columnId: 'col2', position: 0 },
        select: SELECT,
      });
    });

    it('rebalances in a transaction when the neighbor gap collapses', async () => {
      task.findFirst.mockResolvedValue({ id: 't3' });
      column.findFirst.mockResolvedValue({ id: 'col1' });
      task.findMany.mockResolvedValue([
        { id: 't1', position: 1 },
        { id: 't2', position: 1.0000001 },
        { id: 't3', position: 5 },
      ]);
      $transaction.mockResolvedValue([
        { id: 't1', columnId: 'col1', title: 'A', position: 1 },
        { id: 't3', columnId: 'col1', title: 'C', position: 2 },
        { id: 't2', columnId: 'col1', title: 'B', position: 3 },
      ]);

      const result = await service.move('w1', 'b1', 't3', { targetColumnId: 'col1', afterId: 't1' });

      // others = [t1, t2]; insert t3 after t1 -> [t1, t3, t2] -> positions 1,2,3
      // the moved task (t3) also gets columnId set
      expect(task.update).toHaveBeenNthCalledWith(1, {
        where: { id: 't1' },
        data: { position: 1 },
        select: SELECT,
      });
      expect(task.update).toHaveBeenNthCalledWith(2, {
        where: { id: 't3' },
        data: { columnId: 'col1', position: 2 },
        select: SELECT,
      });
      expect(task.update).toHaveBeenNthCalledWith(3, {
        where: { id: 't2' },
        data: { position: 3 },
        select: SELECT,
      });
      expect($transaction).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ id: 't3', columnId: 'col1', title: 'C', position: 2 });
    });

    it('rejects move when the anchor task is not in the target column', async () => {
      task.findFirst.mockResolvedValue({ id: 't1' });
      column.findFirst.mockResolvedValue({ id: 'col1' });
      task.findMany.mockResolvedValue(col1);
      await expect(
        service.move('w1', 'b1', 't1', { targetColumnId: 'col1', afterId: 'tX' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('rejects move of a task outside the board', async () => {
      task.findFirst.mockResolvedValue(null);
      await expect(
        service.move('w1', 'b1', 'tX', { targetColumnId: 'col1', afterId: null }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(task.findMany).not.toHaveBeenCalled();
    });

    it('rejects move to a target column outside the board', async () => {
      task.findFirst.mockResolvedValue({ id: 't1' });
      column.findFirst.mockResolvedValue(null);
      await expect(
        service.move('w1', 'b1', 't1', { targetColumnId: 'colX', afterId: null }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(task.findMany).not.toHaveBeenCalled();
    });
  });
});
