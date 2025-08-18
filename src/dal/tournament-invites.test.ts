import {
  AppAuthError,
  ERROR_CODES,
  TournamentNotFoundError,
} from "@/lib/errors";
import {
  createSupabaseMock,
  sampleSupabaseAppError,
  sampleSupabaseResponseFailure,
} from "../../tests/utils/__mocks__/supabase";
import { checkAuthReturnsError } from "../../tests/utils/authCheckTest";
import {
  acceptTournamentInvite,
  getInviteManagement,
  getTournamentInviteInfo,
} from "./tournament-invites";
import * as queries from "./tournament-invites-queries";
import { PostgrestError } from "@supabase/supabase-js";

beforeEach(() => {
  vi.resetAllMocks();
  createSupabaseMock();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

vi.mock("./tournament-invites-queries");

describe("getInviteManagement", () => {
  beforeEach(() => {
    vi.mocked(queries.getTournamentId).mockResolvedValue({
      data: {
        id: "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
      },
      error: null,
      count: 1,
      status: 200,
      statusText: "ok",
    });
    vi.mocked(queries.checkUserIsTournamentAdmin).mockResolvedValue({
      data: {
        tournament_id: "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
      },
      error: null,
      count: 1,
      status: 200,
      statusText: "ok",
    });
    vi.mocked(queries.getAdminEmails).mockResolvedValue({
      data: [
        {
          email: "Z4bNt@example.com",
        },
        {
          email: "Ht5x2@example.com",
        },
      ],
      error: null,
      count: 1,
      status: 200,
      statusText: "ok",
    });
    vi.mocked(queries.getInviteId).mockResolvedValue({
      data: {
        id: "68b0f1b2-2425-4abb-b295-b51c7c2fdd1d",
      },
      error: null,
      count: 1,
      status: 200,
      statusText: "ok",
    });
  });

  checkAuthReturnsError(getInviteManagement, "test-tournament");

  it("validates fields", async () => {
    const result = await getInviteManagement(5 as unknown as string);
    expect(result).toEqual({
      error: TournamentNotFoundError,
    });
  });

  it("fetches tournamentId", async () => {
    vi.mocked(queries.getTournamentId).mockResolvedValueOnce({
      data: null,
      error: null,
      count: 0,
      status: 200,
      statusText: "ok",
    });
    const result = await getInviteManagement("test-tournament");
    expect(queries.getTournamentId).toHaveBeenCalledExactlyOnceWith(
      "test-tournament",
    );
    expect(result).toEqual({ error: TournamentNotFoundError });
    vi.mocked(queries.getTournamentId).mockResolvedValue(
      sampleSupabaseResponseFailure,
    );
    const result2 = await getInviteManagement("test-tournament");
    expect(result2).toEqual({ error: sampleSupabaseAppError });
  });

  it("checks if user is admin", async () => {
    await getInviteManagement("test-tournament");
    expect(queries.checkUserIsTournamentAdmin).toHaveBeenCalledExactlyOnceWith(
      "11111111-1111-1111-1111-111111111111",
      "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
    );
    vi.mocked(queries.checkUserIsTournamentAdmin).mockResolvedValueOnce(
      sampleSupabaseResponseFailure,
    );
    const result = await getInviteManagement("test-tournament");
    expect(result).toEqual({
      error: {
        message: "Unauthorized access",
        code: ERROR_CODES.UNAUTHORIZED,
        status: 401,
      },
    });
    vi.mocked(queries.checkUserIsTournamentAdmin).mockResolvedValueOnce({
      data: null,
      error: null,
      count: 0,
      status: 200,
      statusText: "ok",
    });
    const result2 = await getInviteManagement("test-tournament");
    expect(result2).toEqual({
      error: {
        message: "Unauthorized access",
        code: ERROR_CODES.UNAUTHORIZED,
        status: 401,
      },
    });
  });

  it("gets all admin emails", async () => {
    await getInviteManagement("test-tournament");
    expect(queries.getAdminEmails).toHaveBeenCalledExactlyOnceWith(
      "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
    );
    vi.mocked(queries.getAdminEmails).mockResolvedValueOnce(
      sampleSupabaseResponseFailure,
    );
    const result = await getInviteManagement("test-tournament");
    expect(result).toEqual({ error: sampleSupabaseAppError });
  });

  it("handles null admin emails array", async () => {
    vi.mocked(queries.getAdminEmails).mockResolvedValueOnce({
      data: null as unknown as { email: string }[],
      error: null,
      count: 0,
      status: 200,
      statusText: "ok",
    });
    const result = await getInviteManagement("test-tournament");
    expect(result).toEqual({
      data: {
        link: "http://localhost:3000/tournaments/invite/68b0f1b2-2425-4abb-b295-b51c7c2fdd1d",
        emails: [],
      },
    });
  });

  it("gets invite id", async () => {
    await getInviteManagement("test-tournament");
    expect(queries.getInviteId).toHaveBeenCalledExactlyOnceWith(
      "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
    );
    vi.mocked(queries.getInviteId).mockResolvedValueOnce(
      sampleSupabaseResponseFailure,
    );
    const result = await getInviteManagement("test-tournament");
    expect(result).toEqual({ error: sampleSupabaseAppError });
    vi.mocked(queries.getInviteId).mockResolvedValueOnce({
      data: {
        id: null as unknown as string,
      },
      error: null,
      count: 0,
      status: 200,
      statusText: "ok",
    });
    const result2 = await getInviteManagement("test-tournament");
    expect(result2).toEqual({
      data: {
        link: "Couldn't retrieve invite link",
        emails: ["Z4bNt@example.com", "Ht5x2@example.com"],
      },
    });
  });

  it("returns emails and invite link", async () => {
    const result = await getInviteManagement("test-tournament");
    expect(result).toEqual({
      data: {
        link: `${process.env.NEXT_PUBLIC_SITE_URL}/tournaments/invite/68b0f1b2-2425-4abb-b295-b51c7c2fdd1d`,
        emails: ["Z4bNt@example.com", "Ht5x2@example.com"],
      },
    });
  });
});

describe("getTournamentInviteInfo", () => {
  beforeEach(() => {
    vi.mocked(queries.getInviteInfo).mockResolvedValue({
      data: [
        {
          name: "Test Tournament",
          division: "B",
          image_url: "https://example.com/image.jpg",
        },
      ],
      error: null,
      count: 0,
      status: 200,
      statusText: "ok",
    });
  });

  checkAuthReturnsError(
    getTournamentInviteInfo,
    "68b0f1b2-2425-4abb-b295-b51c7c2fdd1d",
  );

  it("validates invite id", async () => {
    const result = await getTournamentInviteInfo("invalid uuid");
    expect(result).toEqual({ error: TournamentNotFoundError });
  });

  it("calls get invite info rpc", async () => {
    const result = await getTournamentInviteInfo(
      "68b0f1b2-2425-4abb-b295-b51c7c2fdd1d",
    );
    expect(queries.getInviteInfo).toHaveBeenCalledExactlyOnceWith(
      "68b0f1b2-2425-4abb-b295-b51c7c2fdd1d",
    );
    expect(result).toEqual({
      data: {
        name: "Test Tournament",
        division: "B",
        imageUrl: "https://example.com/image.jpg",
      },
    });
  });

  it("handles empty database response", async () => {
    vi.mocked(queries.getInviteInfo).mockResolvedValueOnce({
      data: [],
      error: null,
      count: 0,
      status: 200,
      statusText: "ok",
    });
    const result = await getTournamentInviteInfo(
      "68b0f1b2-2425-4abb-b295-b51c7c2fdd1d",
    );
    expect(result).toEqual({ error: TournamentNotFoundError });
  });

  it("handles rpc errors", async () => {
    vi.mocked(queries.getInviteInfo).mockResolvedValueOnce(
      sampleSupabaseResponseFailure,
    );
    const result = await getTournamentInviteInfo(
      "68b0f1b2-2425-4abb-b295-b51c7c2fdd1d",
    );
    expect(result).toEqual({ error: sampleSupabaseAppError });
    vi.mocked(queries.getInviteInfo).mockResolvedValueOnce({
      data: null,
      error: new PostgrestError({
        message: `${ERROR_CODES.UNAUTHORIZED} Unauthorized access`,
        code: "P0001",
        hint: "baz",
        details: "details",
      }),
      count: null,
      status: 400,
      statusText: "Bad Request",
    });
    const result2 = await getTournamentInviteInfo(
      "68b0f1b2-2425-4abb-b295-b51c7c2fdd1d",
    );
    expect(result2).toEqual({
      error: AppAuthError,
    });
    vi.mocked(queries.getInviteInfo).mockResolvedValueOnce({
      data: null,
      error: new PostgrestError({
        message: `${ERROR_CODES.NOT_FOUND} tournament not found`,
        code: "P0001",
        hint: "baz",
        details: "details",
      }),
      count: null,
      status: 400,
      statusText: "Bad Request",
    });
    const result3 = await getTournamentInviteInfo(
      "68b0f1b2-2425-4abb-b295-b51c7c2fdd1d",
    );
    expect(result3).toEqual({
      error: TournamentNotFoundError,
    });
    vi.mocked(queries.getInviteInfo).mockResolvedValueOnce({
      data: null,
      error: new PostgrestError({
        message: `unknown error`,
        code: "P0001",
        hint: "baz",
        details: "details",
      }),
      count: null,
      status: 400,
      statusText: "Bad Request",
    });
    const result4 = await getTournamentInviteInfo(
      "68b0f1b2-2425-4abb-b295-b51c7c2fdd1d",
    );
    expect(result4).toEqual({
      error: {
        message: "Unknown exception was raised",
        code: ERROR_CODES.UNKNOWN,
        status: 400,
      },
    });
  });
});

describe("acceptTournamentInvite", () => {
  beforeEach(() => {
    vi.mocked(queries.acceptInvite).mockResolvedValue({
      data: "test-tournament",
      error: null,
      count: 0,
      status: 200,
      statusText: "ok",
    });
  });
  checkAuthReturnsError(
    acceptTournamentInvite,
    "68b0f1b2-2425-4abb-b295-b51c7c2fdd1d",
  );

  it("validates invite id", async () => {
    const result = await acceptTournamentInvite("invalid uuid");
    expect(result).toEqual({ error: TournamentNotFoundError });
  });

  it("calls accept invite rpc", async () => {
    const result = await acceptTournamentInvite(
      "68b0f1b2-2425-4abb-b295-b51c7c2fdd1d",
    );
    expect(queries.acceptInvite).toHaveBeenCalledExactlyOnceWith(
      "68b0f1b2-2425-4abb-b295-b51c7c2fdd1d",
    );
    expect(result).toEqual({
      data: {
        slug: "test-tournament",
      },
    });
  });

  it("handles empty invite id", async () => {
    vi.mocked(queries.acceptInvite).mockResolvedValueOnce({
      data: null,
      error: null,
      count: 0,
      status: 200,
      statusText: "ok",
    });
    const result = await acceptTournamentInvite(
      "68b0f1b2-2425-4abb-b295-b51c7c2fdd1d",
    );
    expect(result).toEqual({ error: TournamentNotFoundError });
  });

  it("handles rpc errors", async () => {
    vi.mocked(queries.acceptInvite).mockResolvedValueOnce(
      sampleSupabaseResponseFailure,
    );
    const result = await acceptTournamentInvite(
      "68b0f1b2-2425-4abb-b295-b51c7c2fdd1d",
    );
    expect(result).toEqual({ error: sampleSupabaseAppError });
    vi.mocked(queries.acceptInvite).mockResolvedValueOnce({
      data: null,
      error: new PostgrestError({
        message: `${ERROR_CODES.UNAUTHORIZED} Unauthorized access`,
        code: "P0001",
        hint: "baz",
        details: "details",
      }),
      count: null,
      status: 400,
      statusText: "Bad Request",
    });
    const result2 = await acceptTournamentInvite(
      "68b0f1b2-2425-4abb-b295-b51c7c2fdd1d",
    );
    expect(result2).toEqual({
      error: AppAuthError,
    });
    vi.mocked(queries.acceptInvite).mockResolvedValueOnce({
      data: null,
      error: new PostgrestError({
        message: `${ERROR_CODES.NOT_FOUND} tournament not found`,
        code: "P0001",
        hint: "baz",
        details: "details",
      }),
      count: null,
      status: 400,
      statusText: "Bad Request",
    });
    const result3 = await acceptTournamentInvite(
      "68b0f1b2-2425-4abb-b295-b51c7c2fdd1d",
    );
    expect(result3).toEqual({
      error: TournamentNotFoundError,
    });
    vi.mocked(queries.acceptInvite).mockResolvedValueOnce({
      data: null,
      error: new PostgrestError({
        message: `unknown error`,
        code: "P0001",
        hint: "baz",
        details: "details",
      }),
      count: null,
      status: 400,
      statusText: "Bad Request",
    });
    const result4 = await acceptTournamentInvite(
      "68b0f1b2-2425-4abb-b295-b51c7c2fdd1d",
    );
    expect(result4).toEqual({
      error: {
        message: "Unknown exception was raised",
        code: ERROR_CODES.UNKNOWN,
        status: 400,
      },
    });
  });
});
