export const createClient = vi.fn(() => ({
  from: vi.fn(() => ({
    select: vi.fn().mockReturnValue({ data: [], error: null }),
    insert: vi.fn().mockReturnValue({ data: [], error: null }),
  })),
}));