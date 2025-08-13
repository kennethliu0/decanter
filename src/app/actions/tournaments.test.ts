import { acceptTournamentInvite } from "@/dal/tournament-invites";
import { upsertTournamentApplication } from "@/dal/tournament-application";
import {
  acceptTournamentInviteAction,
  upsertTournamentAction,
  upsertTournamentApplicationAction,
} from "./tournaments";
import { redirect, notFound } from "next/navigation";
import {
  AppAuthError,
  ERROR_CODES,
  TournamentNotFoundError,
} from "@/lib/errors";
import { infer as zodInfer } from "zod/v4";
import {
  EditTournamentSchemaServer,
  InsertTournamentApplicationSchema,
} from "@/lib/definitions";
import {
  insertTournament,
  updateTournament,
} from "@/dal/tournament-management";

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation");
  return {
    ...actual,
    redirect: vi.fn(() => {
      throw new Error("NEXT_REDIRECT");
    }),
    notFound: vi.fn(() => {
      throw new Error("NEXT_NOT_FOUND");
    }),
  };
});
vi.mock("@/dal/tournament-management");
vi.mock("@/dal/tournament-application");
vi.mock("@/dal/tournament-invites");

beforeEach(() => {
  vi.resetAllMocks();
});

describe("upsertTournamentAction", () => {
  const sampleTournament: zodInfer<typeof EditTournamentSchemaServer> = {
    imageUrl: "https://example.com/image.jpg",
    websiteUrl: "https://example.com",
    name: "Example Tournament",
    location: "Online",
    division: "B",
    closedEarly: false,
    applicationFields: [
      {
        prompt: "Field 1",
        type: "short",
        id: "b19e87ed-81eb-4b16-86c4-e7e7887e7176",
      },
    ],
    startDate: "2025-03-01",
    endDate: "2025-03-31",
    applyDeadline: "2025-02-15T12:00:00.000Z",
    //id: "bf1cd522-89b1-4152-9f9a-ff426ce634a9",
  };

  it("validates user inputs", async () => {
    const invalidTournament = {
      ...sampleTournament,
      websiteUrl: "invalid url",
    };
    const result = await upsertTournamentAction(undefined, invalidTournament);
    expect(insertTournament).not.toHaveBeenCalled();
    expect(result.errors).toEqual({ websiteUrl: ["Invalid URL"] });
    expect(result.success).toBe(false);
  });

  it("calls updateTournament if ID is present", async () => {
    vi.mocked(updateTournament).mockResolvedValue({});
    const result = await upsertTournamentAction(undefined, {
      ...sampleTournament,
      id: "bf1cd522-89b1-4152-9f9a-ff426ce634a9",
    });
    expect(updateTournament).toHaveBeenCalledExactlyOnceWith(
      "bf1cd522-89b1-4152-9f9a-ff426ce634a9",
      { ...sampleTournament, id: "bf1cd522-89b1-4152-9f9a-ff426ce634a9" },
    );
    expect(result.success).toBe(true);
    expect(redirect).not.toHaveBeenCalled();
  });

  it("calls insertTournament if ID is absent", async () => {
    vi.mocked(insertTournament).mockResolvedValue({
      data: { slug: "test-tournament-slug" },
    });

    await expect(
      upsertTournamentAction(undefined, sampleTournament),
    ).rejects.toThrow("NEXT_REDIRECT");
    expect(insertTournament).toHaveBeenCalledTimes(1);
    expect(insertTournament).toHaveBeenCalledWith(sampleTournament);
    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith(
      "/tournaments/manage/test-tournament-slug",
    );
  });

  it("redirects to login page if unauthenticated", async () => {
    vi.mocked(insertTournament).mockResolvedValue({ error: AppAuthError });
    await expect(
      upsertTournamentAction(undefined, sampleTournament),
    ).rejects.toThrow("NEXT_REDIRECT");
    expect(redirect).toHaveBeenCalledExactlyOnceWith("/login");
    vi.mocked(redirect).mockClear();

    vi.mocked(updateTournament).mockResolvedValue({ error: AppAuthError });
    await expect(
      upsertTournamentAction(undefined, {
        ...sampleTournament,
        id: "bf1cd522-89b1-4152-9f9a-ff426ce634a9",
      }),
    ).rejects.toThrow("NEXT_REDIRECT");
    expect(redirect).toHaveBeenCalledExactlyOnceWith("/login");
  });

  it("calls notFound if ID doesn't match", async () => {
    vi.mocked(insertTournament).mockResolvedValue({
      error: TournamentNotFoundError,
    });
    await expect(
      upsertTournamentAction(undefined, sampleTournament),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFound).toHaveBeenCalledTimes(1);
    vi.mocked(notFound).mockClear();

    vi.mocked(updateTournament).mockResolvedValue({
      error: TournamentNotFoundError,
    });
    await expect(
      upsertTournamentAction(undefined, {
        ...sampleTournament,
        id: "bf1cd522-89b1-4152-9f9a-ff426ce634a9",
      }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it("returns error message", async () => {
    vi.mocked(insertTournament).mockResolvedValue({
      error: {
        message: "Misc. error",
        code: ERROR_CODES.UNKNOWN,
      },
    });
    const result = await upsertTournamentAction(undefined, sampleTournament);
    expect(result.success).toBe(false);
    expect(result.message).toBe("Misc. error");

    vi.mocked(updateTournament).mockResolvedValue({
      error: {
        message: "Misc. error",
        code: ERROR_CODES.UNKNOWN,
      },
    });
    const result2 = await upsertTournamentAction(undefined, {
      ...sampleTournament,
      id: "bf1cd522-89b1-4152-9f9a-ff426ce634a9",
    });
    expect(result2.success).toBe(false);
    expect(result2.message).toBe("Misc. error");
  });

  it("handles empty slugs when inserting tournament", async () => {
    vi.mocked(insertTournament).mockResolvedValue({
      data: { slug: "" },
    });
    await expect(
      upsertTournamentAction(undefined, sampleTournament),
    ).rejects.toThrow("NEXT_REDIRECT");
    expect(redirect).toHaveBeenCalledExactlyOnceWith("/tournaments");
  });
});

describe("upsertTournamentApplicationAction", () => {
  const sampleApplication: zodInfer<typeof InsertTournamentApplicationSchema> =
    {
      tournamentId: "bf1cd522-89b1-4152-9f9a-ff426ce634a9",
      responses: [
        {
          fieldId: "b19e87ed-81eb-4b16-86c4-e7e7887e7176",
          response: "Hello",
        },
      ],
      mode: "submit",
      preferences: ["Anatomy and Physiology", "", "", ""],
    };

  it("validates user inputs", async () => {
    const invalidApplication = {
      ...sampleApplication,
      tournamentId: "invalid id",
    };
    const result = await upsertTournamentApplicationAction(
      undefined,
      invalidApplication,
    );
    expect(upsertTournamentApplication).not.toHaveBeenCalled();
    expect(result.errors).toEqual({ tournamentId: ["Invalid UUID"] });
    expect(result.success).toBe(false);
  });

  it("calls upsertTournamentApplication", async () => {
    vi.mocked(upsertTournamentApplication).mockResolvedValue({});
    await upsertTournamentApplicationAction(undefined, sampleApplication);
    expect(upsertTournamentApplication).toHaveBeenCalledTimes(1);
    expect(upsertTournamentApplication).toHaveBeenCalledWith(sampleApplication);
  });

  it("returns success message", async () => {
    vi.mocked(upsertTournamentApplication).mockResolvedValue({});
    const result = await upsertTournamentApplicationAction(
      undefined,
      sampleApplication,
    );
    expect(result.success).toBe(true);
  });

  it("redirects to login page if unauthenticated", async () => {
    vi.mocked(upsertTournamentApplication).mockResolvedValue({
      error: AppAuthError,
    });
    await expect(
      upsertTournamentApplicationAction(undefined, sampleApplication),
    ).rejects.toThrow("NEXT_REDIRECT");
    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith("/login");
  });

  it("calls notFound if ID doesn't match", async () => {
    vi.mocked(upsertTournamentApplication).mockResolvedValue({
      error: TournamentNotFoundError,
    });
    await expect(
      upsertTournamentApplicationAction(undefined, sampleApplication),
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it("returns error message", async () => {
    vi.mocked(upsertTournamentApplication).mockResolvedValue({
      error: {
        message: "Misc. error",
        code: ERROR_CODES.UNKNOWN,
      },
    });
    const result = await upsertTournamentApplicationAction(
      undefined,
      sampleApplication,
    );
    expect(result.success).toBe(false);
    expect(result.message).toBe("Misc. error");
  });
});

describe("acceptTournamentInviteAction", () => {
  const inviteId = "bf1cd522-89b1-4152-9f9a-ff426ce634a9";

  it("validates user inputs", async () => {
    const invalidInviteId = "invalid id";
    await expect(
      acceptTournamentInviteAction(undefined, invalidInviteId),
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(acceptTournamentInvite).not.toHaveBeenCalled();
    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it("calls acceptTournamentInvite", async () => {
    vi.mocked(acceptTournamentInvite).mockResolvedValue({});
    await expect(
      acceptTournamentInviteAction(undefined, inviteId),
    ).rejects.toThrow("NEXT_REDIRECT");
    expect(acceptTournamentInvite).toHaveBeenCalledTimes(1);
    expect(acceptTournamentInvite).toHaveBeenCalledWith(inviteId);
  });

  it("redirects to tournament management page", async () => {
    vi.mocked(acceptTournamentInvite).mockResolvedValue({
      data: { slug: "test-tournament-slug" },
    });
    await expect(
      acceptTournamentInviteAction(undefined, inviteId),
    ).rejects.toThrow("NEXT_REDIRECT");
    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith(
      "/tournaments/manage/test-tournament-slug",
    );
  });

  it("redirects to login page if unauthenticated", async () => {
    vi.mocked(acceptTournamentInvite).mockResolvedValue({
      error: AppAuthError,
    });
    await expect(
      acceptTournamentInviteAction(undefined, inviteId),
    ).rejects.toThrow("NEXT_REDIRECT");
    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith("/login");
  });

  it("calls notFound if ID doesn't match", async () => {
    vi.mocked(acceptTournamentInvite).mockResolvedValue({
      error: TournamentNotFoundError,
    });
    await expect(
      acceptTournamentInviteAction(undefined, inviteId),
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it("returns error message", async () => {
    vi.mocked(acceptTournamentInvite).mockResolvedValue({
      error: {
        message: "Misc. error",
        code: ERROR_CODES.UNKNOWN,
      },
    });
    const result = await acceptTournamentInviteAction(undefined, inviteId);
    expect(result.success).toBe(false);
    expect(result.message).toBe("Misc. error");
  });
});
