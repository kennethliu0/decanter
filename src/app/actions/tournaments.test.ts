import { upsertTournament } from "@/dal/tournament-management";
import { upsertTournamentApplication } from "@/dal/tournament-application";
import {
  upsertTournamentAction,
  upsertTournamentApplicationAction,
} from "./tournaments";
import { redirect, notFound } from "next/navigation";
import { AppAuthError, TournamentNotFoundError } from "@/lib/errors";
import { infer as zodInfer } from "zod/v4";
import {
  EditTournamentSchemaServer,
  InsertTournamentApplicationSchema,
} from "@/lib/definitions";

vi.mock("next/navigation");
vi.mock("@/dal/tournament-management");
vi.mock("@/dal/tournament-application");

vi.mock("server-only", () => {
  return {
    // mock server-only module
  };
});

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
    approved: false,
    id: "bf1cd522-89b1-4152-9f9a-ff426ce634a9",
  };

  it("validates user inputs", async () => {
    const invalidTournament = {
      ...sampleTournament,
      websiteUrl: "invalid url",
    };
    const result = await upsertTournamentAction(undefined, invalidTournament);
    expect(upsertTournament).not.toHaveBeenCalled();
    expect(result.errors).toEqual({ websiteUrl: ["Invalid URL"] });
    expect(result.success).toBe(false);
  });

  it("calls upsertTournament", async () => {
    vi.mocked(upsertTournament).mockResolvedValue({
      data: { slug: "test-tournament-slug" },
    });
    await upsertTournamentAction(undefined, sampleTournament);
    expect(upsertTournament).toHaveBeenCalledTimes(1);
    expect(upsertTournament).toHaveBeenCalledWith(sampleTournament);
  });

  it("returns success message", async () => {
    vi.mocked(upsertTournament).mockResolvedValue({});
    const result = await upsertTournamentAction(undefined, sampleTournament);
    expect(result.success).toBe(true);
  });

  it("redirects to tournament page if operation was insert", async () => {
    vi.mocked(upsertTournament).mockResolvedValue({
      data: { slug: "test-tournament-slug" },
    });
    await upsertTournamentAction(undefined, sampleTournament);
    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith(
      "/tournaments/manage/test-tournament-slug",
    );
  });

  it("does not redirect if operation was update", async () => {
    vi.mocked(upsertTournament).mockResolvedValue({});
    await upsertTournamentAction(undefined, sampleTournament);
    expect(redirect).not.toHaveBeenCalled();
  });

  it("redirects to login page if unauthenticated", async () => {
    vi.mocked(upsertTournament).mockResolvedValue({ error: AppAuthError });
    await upsertTournamentAction(undefined, sampleTournament);
    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith("/login");
  });

  it("calls notFound if ID doesn't match", async () => {
    vi.mocked(upsertTournament).mockResolvedValue({
      error: TournamentNotFoundError,
    });
    await upsertTournamentAction(undefined, sampleTournament);
    expect(notFound).toHaveBeenCalledTimes(1);
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
    await upsertTournamentApplicationAction(undefined, sampleApplication);
    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith("/login");
  });

  it("calls notFound if ID doesn't match", async () => {
    vi.mocked(upsertTournamentApplication).mockResolvedValue({
      error: TournamentNotFoundError,
    });
    await upsertTournamentApplicationAction(undefined, sampleApplication);
    expect(notFound).toHaveBeenCalledTimes(1);
  });
});
