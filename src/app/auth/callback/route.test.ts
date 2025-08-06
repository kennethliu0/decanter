import { SupabaseClient } from "@supabase/supabase-js";
import { GET } from "./route";
import { Mock } from "vitest";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import * as utils from "@/lib/utils";
import { create } from "domain";

const createSupabaseMock = (exchangeCodeForSessionMock?: Mock) => {
  return vi.mocked(createClient).mockResolvedValue({
    auth: {
      exchangeCodeForSession:
        exchangeCodeForSessionMock
        ?? vi.fn(() => ({
          error: null,
        })),
    },
  } as unknown as SupabaseClient);
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe("/auth/callback", () => {
  it("checks code param", async () => {
    using spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const response = await GET(
      new NextRequest(`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`),
    );
    expect(spy).toHaveBeenCalledExactlyOnceWith(
      "Error exchanging code for session or missing code",
    );
    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toBe(
      `${process.env.NEXT_PUBLIC_SITE_URL}/login?message=oauth-failed`,
    );
    expect(createClient).toHaveBeenCalledTimes(0);
  });
  it("calls Supabase", async () => {
    const exchangeCodeForSessionMock = vi.fn().mockResolvedValue({
      error: null,
    });
    const createClientMock = createSupabaseMock(exchangeCodeForSessionMock);
    await GET(
      new NextRequest(
        `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?code=1234`,
      ),
    );
    expect(exchangeCodeForSessionMock).toHaveBeenCalledExactlyOnceWith("1234");
    expect(createClientMock).toHaveBeenCalledTimes(1);
  });
  it("handles Supabase errors", async () => {
    const exchangeCodeForSessionMock = vi.fn().mockResolvedValue({
      error: true,
    });
    createSupabaseMock(exchangeCodeForSessionMock);
    using spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const response = await GET(
      new NextRequest(
        `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?code=1234`,
      ),
    );
    expect(spy).toHaveBeenCalledExactlyOnceWith(
      "Error exchanging code for session or missing code",
    );
    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toBe(
      `${process.env.NEXT_PUBLIC_SITE_URL}/login?message=oauth-failed`,
    );
  });
  it("uses the 'next' param", async () => {
    createSupabaseMock();
    const response = await GET(
      new NextRequest(
        `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?code=1234&next=%2Ftournaments`,
      ),
    );
    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toBe(
      `${process.env.NEXT_PUBLIC_SITE_URL}/tournaments`,
    );
  });
  it("should check unsafe 'next' params", async () => {
    createSupabaseMock();
    using isSafeSpy = vi.spyOn(utils, "isSafeRedirect");
    const response = await GET(
      new NextRequest(
        `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?code=1234&next=https://evil.com`,
      ),
    );
    expect(isSafeSpy).toHaveBeenCalledExactlyOnceWith("https://evil.com");
    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toBe(
      `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
    );
  });
});
