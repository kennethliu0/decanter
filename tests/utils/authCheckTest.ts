import { AppAuthError } from "@/lib/errors";
import { createClient } from "@/utils/supabase/server";
import { AuthError, SupabaseClient } from "@supabase/supabase-js";

export async function checkAuthReturnsError<T extends (...args: any[]) => any>(
  func: T,
  ...args: Parameters<T>
) {
  it("check authentication returns error", async () => {
    const getClaimsMock = vi.fn().mockResolvedValue({
      data: {},
    });
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getClaims: getClaimsMock,
      },
    } as unknown as SupabaseClient);
    const result = await func(...args);
    expect(result).toEqual({ error: AppAuthError });
    expect(getClaimsMock).toHaveBeenCalledTimes(1);
    getClaimsMock.mockClear();

    getClaimsMock.mockResolvedValue({
      error: new AuthError("foo"),
    });
    const result2 = await func(...args);
    expect(result2).toEqual({ error: AppAuthError });
    expect(getClaimsMock).toHaveBeenCalledTimes(1);
  });
}
