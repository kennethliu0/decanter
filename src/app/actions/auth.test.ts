// src/app/actions/auth.test.ts
import { createClient } from "@/utils/supabase/server";
import { logout, signInWithGoogleAction } from "./auth";
import { AuthApiError, SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { type Mock, vi } from "vitest";
import { headers } from "next/headers";

vi.mock("next/cache");

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => ({
    get: vi.fn((key) =>
      key === "origin" ? `${process.env.NEXT_PUBLIC_SITE_URL}` : null,
    ),
  })),
}));

beforeEach(() => {
  vi.resetAllMocks();
});

function createSignOutSupabaseMock(signOutMock?: Mock) {
  return vi.mocked(createClient).mockResolvedValue({
    auth: {
      signOut: signOutMock ?? vi.fn().mockResolvedValue({ error: null }),
    },
  } as unknown as SupabaseClient);
}

describe("logout", async () => {
  it("calls signOut on the Supabase Client", async () => {
    const signOutMock = vi.fn().mockResolvedValue({ error: null });
    createSignOutSupabaseMock(signOutMock);

    await expect(logout()).rejects.toThrow("NEXT_REDIRECT");

    expect(createClient).toHaveBeenCalledTimes(1);
    expect(signOutMock).toHaveBeenCalledTimes(1);
  });

  it("redirects to login page", async () => {
    createSignOutSupabaseMock();

    await expect(logout()).rejects.toThrow("NEXT_REDIRECT");

    expect(revalidatePath).toHaveBeenCalledTimes(1);
    expect(revalidatePath).toHaveBeenCalledWith("/login", "layout");
    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith("/login");
  });

  it("returns an error message", async () => {
    createSignOutSupabaseMock(
      vi.fn().mockResolvedValue({
        error: new AuthApiError("message", 400, undefined),
      }),
    );
    vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await logout();

    expect(result).toEqual({ message: "An error occurred while logging out." });
  });

  it("outputs an error message to console", async () => {
    createSignOutSupabaseMock(
      vi.fn().mockResolvedValue({
        error: new AuthApiError("message", 400, undefined),
      }),
    );

    using spy = vi.spyOn(console, "error").mockImplementation(() => {});

    await logout();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("Log out error", {
      message: "message",
      code: undefined,
      name: "AuthApiError",
    });
  });
});

function createSignInSupabaseMock(signInMock?: Mock) {
  return vi.mocked(createClient).mockResolvedValue({
    auth: {
      signInWithOAuth:
        signInMock
        ?? vi
          .fn()
          .mockResolvedValue({ data: { url: "http://googleauth.com" } }),
    },
  } as unknown as SupabaseClient);
}

describe("signInWithGoogleAction", async () => {
  it("calls signIn on the Supabase client", async () => {
    const signInMock = vi
      .fn()
      .mockResolvedValue({ data: { url: "http://googleauth.com" } });
    createSignInSupabaseMock(signInMock);

    await expect(signInWithGoogleAction("")).rejects.toThrow("NEXT_REDIRECT");

    expect(createClient as Mock).toHaveBeenCalledTimes(1);
    expect(signInMock).toHaveBeenCalledTimes(1);
    expect(signInMock).toHaveBeenCalledWith({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=%2Fdashboard`,
      },
    });
  });

  it("sets redirect based on the parameter", async () => {
    const signInMock = vi
      .fn()
      .mockResolvedValue({ data: { url: "http://googleauth.com" } });
    createSignInSupabaseMock(signInMock);

    await expect(signInWithGoogleAction("/tournaments")).rejects.toThrow(
      "NEXT_REDIRECT",
    );

    expect(signInMock).toHaveBeenCalledTimes(1);
    expect(signInMock).toHaveBeenCalledWith({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=%2Ftournaments`,
      },
    });
  });

  it("checks for unsafe redirects", async () => {
    const signInMock = vi
      .fn()
      .mockResolvedValue({ data: { url: "http://googleauth.com" } });
    createSignInSupabaseMock(signInMock);

    await expect(signInWithGoogleAction("https://evil.com")).rejects.toThrow(
      "NEXT_REDIRECT",
    );

    expect(signInMock).toHaveBeenCalledTimes(1);
    expect(signInMock).toHaveBeenCalledWith({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=%2Fdashboard`,
      },
    });
  });

  it("checks request origin", async () => {
    const signInMock = vi
      .fn()
      .mockResolvedValue({ data: { url: "http://googleauth.com" } });
    createSignInSupabaseMock(signInMock);

    vi.mocked(headers).mockResolvedValue({
      get: vi.fn((key) => (key === "origin" ? "https://evil.com" : null)),
    } as unknown as Headers);

    using spy = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(signInWithGoogleAction("/tournaments")).rejects.toThrow(
      "NEXT_REDIRECT",
    );

    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith("/login");
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("Untrusted origin:", "https://evil.com");
  });

  it("checks google auth url", async () => {
    const signInMock = vi.fn().mockResolvedValue({ data: { url: "" } });
    createSignInSupabaseMock(signInMock);

    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(signInWithGoogleAction("/tournaments")).rejects.toThrow(
      "NEXT_REDIRECT",
    );

    expect(signInMock).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith("/login?message=oauth_failed");
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("signInWithOAuth did not return a URL");
  });
});
