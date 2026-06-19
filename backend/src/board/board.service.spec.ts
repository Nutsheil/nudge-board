import { NotFoundException } from '@nestjs/common';

import { type PrismaService } from '../prisma/prisma.service';
import { BoardService } from './board.service';

describe('BoardService', () => {
  const board = {
    findMany: jest.fn(),
    create: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const prisma = { board } as unknown as PrismaService;
  let service: BoardService;

  beforeEach(() => {
    Object.values(board).forEach((fn) => fn.mockReset());
    service = new BoardService(prisma);
  });

  it('lists boards of a workspace ordered by createdAt', async () => {
    const rows = [{ id: 'b1', name: 'A', description: null, createdAt: new Date() }];
    board.findMany.mockResolvedValue(rows);

    const result = await service.list('w1');

    expect(board.findMany).toHaveBeenCalledWith({
      where: { workspaceId: 'w1' },
      orderBy: { createdAt: 'asc' },
      select: { id: true, name: true, description: true, createdAt: true },
    });
    expect(result).toBe(rows);
  });

  it('creates a board in the workspace', async () => {
    const created = { id: 'b1', name: 'A', description: null, createdAt: new Date() };
    board.create.mockResolvedValue(created);

    const result = await service.create('w1', { name: 'A' });

    expect(board.create).toHaveBeenCalledWith({
      data: { workspaceId: 'w1', name: 'A', description: undefined },
      select: { id: true, name: true, description: true, createdAt: true },
    });
    expect(result).toBe(created);
  });

  it('returns the board tree with columns and their enriched tasks', async () => {
    board.findFirst.mockResolvedValue({
      id: 'b1',
      name: 'A',
      description: null,
      columns: [
        {
          id: 'c1',
          name: 'To Do',
          position: 1,
          tasks: [
            {
              id: 't1',
              columnId: 'c1',
              title: 'First',
              position: 1,
              priority: 'HIGH',
              dueDate: null,
              assignees: [{ user: { id: 'u1', name: 'Ann' } }],
            },
          ],
        },
      ],
    });

    const result = await service.getBoard('w1', 'b1');

    expect(board.findFirst).toHaveBeenCalledWith({
      where: { id: 'b1', workspaceId: 'w1' },
      include: {
        columns: {
          orderBy: { position: 'asc' },
          select: {
            id: true,
            name: true,
            position: true,
            tasks: {
              orderBy: { position: 'asc' },
              select: {
                id: true,
                columnId: true,
                title: true,
                position: true,
                priority: true,
                dueDate: true,
                assignees: { select: { user: { select: { id: true, name: true } } } },
              },
            },
          },
        },
      },
    });
    expect(result.columns[0].tasks[0]).toEqual({
      id: 't1',
      columnId: 'c1',
      title: 'First',
      position: 1,
      priority: 'HIGH',
      dueDate: null,
      assignees: [{ id: 'u1', name: 'Ann' }],
    });
  });

  it('throws NotFound when the board is not in the workspace', async () => {
    board.findFirst.mockResolvedValue(null);
    await expect(service.getBoard('w1', 'bX')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('updates only after asserting ownership', async () => {
    board.findFirst.mockResolvedValue({ id: 'b1' });
    const updated = { id: 'b1', name: 'B', description: null, createdAt: new Date() };
    board.update.mockResolvedValue(updated);

    const result = await service.update('w1', 'b1', { name: 'B' });

    expect(board.findFirst).toHaveBeenCalledWith({ where: { id: 'b1', workspaceId: 'w1' }, select: { id: true } });
    expect(board.update).toHaveBeenCalledWith({
      where: { id: 'b1' },
      data: { name: 'B', description: undefined },
      select: { id: true, name: true, description: true, createdAt: true },
    });
    expect(result).toBe(updated);
  });

  it('rejects update of a board outside the workspace', async () => {
    board.findFirst.mockResolvedValue(null);
    await expect(service.update('w1', 'bX', { name: 'B' })).rejects.toBeInstanceOf(NotFoundException);
    expect(board.update).not.toHaveBeenCalled();
  });

  it('deletes only after asserting ownership', async () => {
    board.findFirst.mockResolvedValue({ id: 'b1' });
    board.delete.mockResolvedValue({ id: 'b1' });

    await service.remove('w1', 'b1');

    expect(board.findFirst).toHaveBeenCalledWith({ where: { id: 'b1', workspaceId: 'w1' }, select: { id: true } });
    expect(board.delete).toHaveBeenCalledWith({ where: { id: 'b1' } });
  });

  it('rejects remove of a board outside the workspace', async () => {
    board.findFirst.mockResolvedValue(null);
    await expect(service.remove('w1', 'bX')).rejects.toBeInstanceOf(NotFoundException);
    expect(board.delete).not.toHaveBeenCalled();
  });
});
