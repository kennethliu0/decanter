import { createClient } from "@/utils/supabase/server";
import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { count } from "console";
import { Mock } from "vitest";

export const mockedFrom = vi.fn(() => ({
  select: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  offset: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  isNull: vi.fn().mockReturnThis(),
  or: vi.fn().mockReturnThis(),
  maybeSingle: vi.fn().mockReturnThis(),
  single: vi.fn().mockReturnThis(),
}));

export function createSupabaseMock(getClaimsMock?: Mock, tableFromMock?: Mock) {
  return vi.mocked(createClient).mockResolvedValue({
    auth: {
      getClaims:
        getClaimsMock
        ?? vi.fn().mockResolvedValue({
          data: {
            claims: {
              sub: "11111111-1111-1111-1111-111111111111",
              email: "email@example.com",
            },
          },
        }),
    },
    from: tableFromMock ?? vi.fn().mockReturnThis(),
  } as unknown as SupabaseClient);
}

export const sampleSupabaseResponseFailure = {
  error: new PostgrestError({
    message: "foo",
    code: "bar",
    hint: "baz",
    details: "details",
  }),
  count: null,
  data: null,
  status: 400,
  statusText: "Bad Request",
};

export const sampleSupabaseAppError = {
  code: "SERVER_ERROR",
  message: "A database error occurred.",
  meta: {
    code: "bar",
    details: "details",
    hint: "baz",
  },
  name: "PostgrestError",
  status: 500,
};
