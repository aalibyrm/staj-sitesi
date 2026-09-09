import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('./client', () => ({ getSupabaseClient: vi.fn() }));

import { getSupabaseClient } from './client';
import { getProjectBySlug, getProjects } from './projectRepository';

const mockedClient = vi.mocked(getSupabaseClient);

describe('projectRepository', () => {
  beforeEach(() => vi.clearAllMocks());

  it('lists only published projects with an explicit single relational query', async () => {
    const order = vi.fn();
    const builder = {
      select: vi.fn(),
      eq: vi.fn(),
      order,
    };
    builder.select.mockReturnValue(builder);
    builder.eq.mockReturnValue(builder);
    order.mockReturnValueOnce(builder).mockResolvedValueOnce({ data: [], error: null });
    const from = vi.fn().mockReturnValue(builder);
    mockedClient.mockReturnValue({ from } as never);

    await getProjects();

    expect(from).toHaveBeenCalledWith('projects');
    expect(builder.select).toHaveBeenCalledOnce();
    expect(builder.select.mock.calls[0][0]).not.toContain('*');
    expect(builder.select.mock.calls[0][0]).toContain('project_students');
    expect(builder.eq).toHaveBeenCalledWith('status', 'published');
    expect(order).toHaveBeenCalledTimes(2);
  });

  it('queries a detail by slug and returns null for a missing published project', async () => {
    const builder = {
      select: vi.fn(),
      eq: vi.fn(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    };
    builder.select.mockReturnValue(builder);
    builder.eq.mockReturnValue(builder);
    const from = vi.fn().mockReturnValue(builder);
    mockedClient.mockReturnValue({ from } as never);

    const result = await getProjectBySlug('missing-project');

    expect(result).toBeNull();
    expect(builder.eq).toHaveBeenCalledWith('slug', 'missing-project');
    expect(builder.eq).toHaveBeenCalledWith('status', 'published');
    expect(builder.select.mock.calls[0][0]).not.toContain('*');
    expect(builder.select.mock.calls[0][0]).toContain('project_sections');
    expect(builder.maybeSingle).toHaveBeenCalledOnce();
  });
});
