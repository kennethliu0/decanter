import { ERROR_CODES, TournamentNotFoundError } from "@/lib/errors";
import {
  createSupabaseMock,
  mockedFrom,
  sampleSupabaseAppError,
  sampleSupabaseResponseFailure,
} from "../../tests/utils/__mocks__/supabase";
import { checkAuthReturnsError } from "../../tests/utils/authCheckTest";
import {
  getSavedTournamentApplication,
  getTournamentApplicationInfo,
  getTournamentCounts,
  getTournaments,
  upsertTournamentApplication,
} from "./tournament-application";
import { PostgrestError } from "@supabase/supabase-js";
import * as queries from "./tournament-application-queries";

beforeEach(() => {
  vi.resetAllMocks();
  createSupabaseMock();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

vi.mock("./tournament-application-queries");

describe("getTournaments", () => {
  checkAuthReturnsError(getTournaments);

  it("calls fetchTournaments", async () => {
    vi.mocked(queries.fetchTournaments).mockResolvedValue({
      data: [
        {
          id: "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
          image_url: "https://sample.org/image.jpg",
          website_url: "https://scilympiad.com/jordan-so",
          name: "Jordan SO Invitational",
          location: "Online",
          division: "B",
          start_date: "2026-03-02",
          end_date: "2026-03-09",
          apply_deadline: "2025-12-01T05:59:59.999+00:00",
          slug: "jordan-so-invit-divb-2026-3ab0f1b2",
          tournament_applications: [{ submitted: false }],
        },
      ],
      error: null,
      count: 1,
      status: 200,
      statusText: "ok",
    });
    const result = await getTournaments();
    expect(queries.fetchTournaments).toHaveBeenCalledExactlyOnceWith(
      "11111111-1111-1111-1111-111111111111",
    );
    expect(result).toEqual({
      data: [
        {
          id: "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
          imageUrl: "https://sample.org/image.jpg",
          websiteUrl: "https://scilympiad.com/jordan-so",
          name: "Jordan SO Invitational",
          location: "Online",
          division: "B",
          startDate: "2026-03-02",
          endDate: "2026-03-09",
          applyDeadline: "2025-12-01T05:59:59.999+00:00",
          slug: "jordan-so-invit-divb-2026-3ab0f1b2",
          applied: false,
        },
      ],
    });
  });

  it("returns error when Supabase returns error", async () => {
    vi.mocked(queries.fetchTournaments).mockResolvedValue(
      sampleSupabaseResponseFailure,
    );
    const result = await getTournaments();
    expect(result).toEqual({
      error: sampleSupabaseAppError,
    });
  });

  it("validates database data", async () => {
    vi.mocked(queries.fetchTournaments).mockResolvedValue({
      data: [
        {
          id: "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
          image_url: "https://sample.org/image.jpg",
          website_url: "https://scilympiad.com/jordan-so",
          name: "Jordan SO Invitational",
          location: "Online",
          division: "D",
          start_date: "2026-03-02",
          end_date: "2026-03-09",
          apply_deadline: "2025-12-01T05:59:59.999+00:00",
          slug: "jordan-so-invit-divb-2026-3ab0f1b2",
          tournament_applications: [{ submitted: false }],
        },
      ],
      error: null,
      count: 1,
      status: 200,
      statusText: "ok",
    });
    const result = await getTournaments();
    expect(result).toEqual({
      error: {
        code: ERROR_CODES.SERVER_ERROR,
        message: "A database error occurred.",
      },
    });
  });
});

describe("getTournamentCounts", () => {
  checkAuthReturnsError(getTournamentCounts);

  it("fetches data from wrappers", async () => {
    vi.mocked(queries.fetchTournamentDivisionsCount).mockResolvedValue({
      data: [
        { division: "B" },
        { division: "C" },
        { division: "B" },
        { division: "C" },
      ],
      error: null,
      count: 1,
      status: 200,
      statusText: "ok",
    });
    vi.mocked(queries.fetchApplicationCount).mockResolvedValue({
      data: [
        { tournament_id: "11111111-1111-1111-1111-111111111111" },
        { tournament_id: "11111111-1111-1111-1111-111111111112" },
        { tournament_id: "11111111-1111-1111-1111-111111111113" },
      ],
      error: null,
      count: 3,
      status: 200,
      statusText: "ok",
    });

    const result = await getTournamentCounts();
    expect(queries.fetchApplicationCount).toHaveBeenCalledExactlyOnceWith(
      "11111111-1111-1111-1111-111111111111",
    );
    expect(queries.fetchTournamentDivisionsCount).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      data: {
        savedApplications: 3,
        tournamentsB: 2,
        tournamentsC: 2,
      },
    });
  });
  it("returns error when fetchApplicationCount returns error", async () => {
    vi.mocked(queries.fetchApplicationCount).mockResolvedValue(
      sampleSupabaseResponseFailure,
    );
    const result = await getTournamentCounts();
    expect(result).toEqual({
      error: sampleSupabaseAppError,
    });
  });
  it("returns error when fetchTournamentDivisionsCount returns error", async () => {
    vi.mocked(queries.fetchApplicationCount).mockResolvedValue({
      data: [
        { tournament_id: "11111111-1111-1111-1111-111111111111" },
        { tournament_id: "11111111-1111-1111-1111-111111111112" },
        { tournament_id: "11111111-1111-1111-1111-111111111113" },
      ],
      error: null,
      count: 3,
      status: 200,
      statusText: "ok",
    });
    vi.mocked(queries.fetchTournamentDivisionsCount).mockResolvedValue(
      sampleSupabaseResponseFailure,
    );
    const result = await getTournamentCounts();
    expect(result).toEqual({
      error: sampleSupabaseAppError,
    });
  });
});

describe("getTournamentApplicationInfo", () => {
  const sampleTournament = {
    id: "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
    image_url: "https://sample.org/image.jpg",
    website_url: "https://scilympiad.com/jordan-so",
    name: "Jordan SO Invitational",
    location: "Online",
    division: "C",
    start_date: "2026-03-02",
    end_date: "2026-03-09",
    apply_deadline: "2025-12-01T05:59:59.999+00:00",
    closed_early: false,
    application_fields: [
      {
        id: "5b6a63b2-43a5-49ec-9d0c-3eb28271d7e9",
        type: "long",
        prompt:
          "Have you written for this tournament in the past? If so, when and what events?",
      },
      {
        id: "00c6b29c-8f47-4cd0-893d-ed4f00fdc654",
        type: "short",
        prompt: "Do you have rizz?",
      },
      {
        id: "3268650d-5ce1-4698-8dfa-71bbd23ed2e6",
        type: "short",
        prompt: "How much time do you have to work on this tournament?",
      },
    ],
  };

  checkAuthReturnsError(getTournamentApplicationInfo, "test-slug");
  it("validates slug", async () => {
    const result = await getTournamentApplicationInfo(5 as unknown as string);
    expect(result).toEqual({ error: TournamentNotFoundError });
  });

  it("fetches data from wrappers", async () => {
    vi.mocked(queries.fetchApplicationInfo).mockResolvedValue({
      data: sampleTournament,
      error: null,
      count: 1,
      status: 200,
      statusText: "ok",
    });

    const result = await getTournamentApplicationInfo("test-slug");
    expect(queries.fetchApplicationInfo).toHaveBeenCalledExactlyOnceWith(
      "test-slug",
    );
    expect(result).toEqual({
      data: {
        application: {
          applicationFields: [
            {
              id: "5b6a63b2-43a5-49ec-9d0c-3eb28271d7e9",
              type: "long",
              prompt:
                "Have you written for this tournament in the past? If so, when and what events?",
            },
            {
              id: "00c6b29c-8f47-4cd0-893d-ed4f00fdc654",
              type: "short",
              prompt: "Do you have rizz?",
            },
            {
              id: "3268650d-5ce1-4698-8dfa-71bbd23ed2e6",
              type: "short",
              prompt: "How much time do you have to work on this tournament?",
            },
          ],
          id: "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
          imageUrl: "https://sample.org/image.jpg",
          websiteUrl: "https://scilympiad.com/jordan-so",
          name: "Jordan SO Invitational",
          location: "Online",
          division: "C",
          startDate: "2026-03-02",
          endDate: "2026-03-09",
          applyDeadline: "2025-12-01T05:59:59.999+00:00",
        },
      },
    });
  });
  it("checks application deadline", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-12-02T05:59:59.999+00:00"));
    vi.mocked(queries.fetchApplicationInfo).mockResolvedValue({
      data: sampleTournament,
      error: null,
      count: 1,
      status: 200,
      statusText: "ok",
    });
    const result = await getTournamentApplicationInfo("test-slug");
    expect(result).toEqual({
      error: {
        message: "Application deadline for this tournament has already passed",
        code: ERROR_CODES.DEADLINE_PASSED,
        status: 422,
      },
    });
    vi.useRealTimers();
  });
  it("checks if tournament exists", async () => {
    vi.mocked(queries.fetchApplicationInfo).mockResolvedValue({
      data: null,
      error: null,
      count: 0,
      status: 200,
      statusText: "ok",
    });
    const result = await getTournamentApplicationInfo("test-slug");
    expect(result).toEqual({ error: TournamentNotFoundError });
  });
  it("checks whether tournament closed early", async () => {
    vi.mocked(queries.fetchApplicationInfo).mockResolvedValue({
      data: { ...sampleTournament, closed_early: true },
      error: null,
      count: 1,
      status: 200,
      statusText: "ok",
    });
    const result = await getTournamentApplicationInfo("test-slug");
    expect(result).toEqual({
      error: {
        message: "Tournament applications have been closed",
        code: ERROR_CODES.DEADLINE_PASSED,
        status: 422,
      },
    });
  });
  it("handles error", async () => {
    vi.mocked(queries.fetchApplicationInfo).mockResolvedValue(
      sampleSupabaseResponseFailure,
    );
    const result = await getTournamentApplicationInfo("test-slug");
    expect(result).toEqual({ error: sampleSupabaseAppError });
  });
  it("validates database data", async () => {
    vi.mocked(queries.fetchApplicationInfo).mockResolvedValue({
      data: { ...sampleTournament, division: "D" },
      error: null,
      count: 1,
      status: 200,
      statusText: "ok",
    });
    const result = await getTournamentApplicationInfo("test-slug");
    expect(result).toEqual({
      error: {
        message: "A database error occurred.",
        code: ERROR_CODES.SERVER_ERROR,
      },
    });
  });
});

describe("getSavedTournamentApplication", () => {
  const sampleApplication = {
    tournamentId: "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
    responses: [
      {
        fieldId: "b19e87ed-81eb-4b16-86c4-e7e7887e7176",
        response: "Hello",
      },
    ],
    mode: "save",
    preferences: ["Anatomy and Physiology", "", "", ""],
  };

  checkAuthReturnsError(getSavedTournamentApplication, "test-slug");

  it("validates fields", async () => {
    const result = await getSavedTournamentApplication(5 as unknown as string);
    expect(result).toEqual({
      error: TournamentNotFoundError,
    });
  });
  it("handles error on fetchTournamentId", async () => {
    vi.mocked(queries.fetchTournamentId).mockResolvedValueOnce(
      sampleSupabaseResponseFailure,
    );
    const res = await getSavedTournamentApplication("test-slug");
    expect(res).toEqual({ error: sampleSupabaseAppError });
  });

  it("handles error on fetchSavedApplication", async () => {
    vi.mocked(queries.fetchTournamentId).mockResolvedValue({
      data: { id: "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d" },
      error: null,
      count: 1,
      status: 200,
      statusText: "ok",
    });
    vi.mocked(queries.fetchSavedApplication).mockResolvedValue(
      sampleSupabaseResponseFailure,
    );
    const result = await getSavedTournamentApplication("test-slug");

    expect(queries.fetchTournamentId).toHaveBeenCalledExactlyOnceWith(
      "test-slug",
    );
    expect(result).toEqual({ error: sampleSupabaseAppError });
  });

  it("gets data from wrappers", async () => {
    vi.mocked(queries.fetchTournamentId).mockResolvedValue({
      data: { id: "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d" },
      error: null,
      count: 1,
      status: 200,
      statusText: "ok",
    });
    vi.mocked(queries.fetchSavedApplication).mockResolvedValue({
      data: { ...sampleApplication, submitted: false },
      error: null,
      count: 1,
      status: 200,
      statusText: "ok",
    });
    const result = await getSavedTournamentApplication("test-slug");
    expect(result).toEqual({
      data: { submitted: false, application: sampleApplication },
    });
  });

  it("checks if tournament exists", async () => {
    vi.mocked(queries.fetchTournamentId).mockResolvedValue({
      data: null,
      error: null,
      count: 0,
      status: 200,
      statusText: "ok",
    });
    const result = await getSavedTournamentApplication("test-slug");
    expect(result).toEqual({ error: TournamentNotFoundError });
  });
  it("checks if saved applciation exists", async () => {
    vi.mocked(queries.fetchTournamentId).mockResolvedValue({
      data: { id: "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d" },
      error: null,
      count: 1,
      status: 200,
      statusText: "ok",
    });
    vi.mocked(queries.fetchSavedApplication).mockResolvedValue({
      data: null,
      error: null,
      count: 0,
      status: 200,
      statusText: "ok",
    });
    const result = await getSavedTournamentApplication("test-slug");
    expect(result).toEqual({});
  });
  it("validates database data", async () => {
    vi.mocked(queries.fetchTournamentId).mockResolvedValue({
      data: { id: "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d" },
      error: null,
      count: 1,
      status: 200,
      statusText: "ok",
    });
    vi.mocked(queries.fetchSavedApplication).mockResolvedValue({
      data: { ...sampleApplication, submitted: false, preferences: [""] },
      error: null,
      count: 1,
      status: 200,
      statusText: "ok",
    });
    const result = await getSavedTournamentApplication("test-slug");
    expect(result).toEqual({
      error: {
        message: "A database error occurred.",
        code: ERROR_CODES.SERVER_ERROR,
      },
    });
  });
});

describe("upsertTournamentApplication", () => {
  const sampleApplication = {
    tournamentId: "bf1cd522-89b1-4152-9f9a-ff426ce634a9",
    responses: [
      {
        fieldId: "b19e87ed-81eb-4b16-86c4-e7e7887e7176",
        response: "Hello",
      },
    ],
    mode: "submit" as const,
    preferences: ["Anatomy and Physiology", "", "", ""],
  };
  beforeEach(() => {
    vi.mocked(queries.fetchTournamentDivision).mockResolvedValue({
      data: { division: "B" },
      error: null,
      count: 0,
      status: 200,
      statusText: "ok",
    });
    vi.mocked(queries.fetchName).mockResolvedValue({
      data: { name: "John Doe" },
      error: null,
      count: 0,
      status: 200,
      statusText: "ok",
    });
    vi.mocked(queries.fetchSavedApplication).mockResolvedValue({
      data: null,
      error: null,
      count: 0,
      status: 200,
      statusText: "ok",
    });
    vi.mocked(queries.upsertApplication).mockResolvedValue({
      data: null,
      error: null,
      count: 0,
      status: 200,
      statusText: "ok",
    });
  });

  checkAuthReturnsError(upsertTournamentApplication, sampleApplication);

  it("validates form fields", async () => {
    const invalidApplication = {
      ...sampleApplication,
      tournamentId: "invalid id",
    };
    const result = await upsertTournamentApplication(invalidApplication);
    expect(result).toEqual({
      error: {
        code: ERROR_CODES.INVALID_INPUT,
        message: "Invalid input.",
        meta: {
          issues: [{ message: "Invalid UUID", path: "tournamentId" }],
        },
        status: 400,
      },
    });
  });
  it("validates event division", async () => {
    vi.mocked(queries.fetchTournamentDivision).mockResolvedValueOnce({
      data: { division: "D" },
      error: null,
      count: 0,
      status: 200,
      statusText: "ok",
    });
    let result = await upsertTournamentApplication(sampleApplication);
    expect(result).toEqual({
      error: {
        message: "Error retrieving tournament",
        code: ERROR_CODES.UNKNOWN,
      },
    });

    const incorrectDivisionApplication = {
      ...sampleApplication,
      preferences: ["Chemistry Lab", "", "", ""],
    };
    result = await upsertTournamentApplication(incorrectDivisionApplication);
    expect(result).toEqual({
      error: {
        code: ERROR_CODES.INVALID_INPUT,
        message: "Invalid event input",
      },
    });
    expect(queries.fetchTournamentDivision).toHaveBeenCalledTimes(2);
    expect(queries.fetchTournamentDivision).toHaveBeenNthCalledWith(
      1,
      "bf1cd522-89b1-4152-9f9a-ff426ce634a9",
    );
    expect(queries.fetchTournamentDivision).toHaveBeenNthCalledWith(
      2,
      "bf1cd522-89b1-4152-9f9a-ff426ce634a9",
    );
  });
  it("returns error if fetchDivision fails", async () => {
    vi.mocked(queries.fetchTournamentDivision).mockResolvedValueOnce(
      sampleSupabaseResponseFailure,
    );
    const result = await upsertTournamentApplication(sampleApplication);
    expect(result).toEqual({ error: sampleSupabaseAppError });
  });
  it("returns error if tournament isn't found", async () => {
    vi.mocked(queries.fetchTournamentDivision).mockResolvedValueOnce({
      data: null,
      error: null,
      count: 0,
      status: 200,
      statusText: "ok",
    });
    const result = await upsertTournamentApplication(sampleApplication);
    expect(result).toEqual({ error: TournamentNotFoundError });
  });
  it("checks that user profile is created", async () => {
    vi.mocked(queries.fetchName).mockResolvedValueOnce({
      data: null,
      error: null,
      count: 0,
      status: 200,
      statusText: "ok",
    });
    const result = await upsertTournamentApplication(sampleApplication);
    expect(queries.fetchName).toHaveBeenCalledExactlyOnceWith(
      "11111111-1111-1111-1111-111111111111",
    );
    expect(result).toEqual({
      error: {
        message: "You must create a volunteer profile before applying",
        code: ERROR_CODES.VOLUNTEER_PROFILE_NOT_FOUND,
      },
    });
  });
  it("checks if application was already submitted", async () => {
    vi.mocked(queries.fetchSavedApplication).mockResolvedValueOnce({
      data: {
        submitted: true,
        preferences: ["Anatomy and Physiology", "", "", ""],
        responses: [],
      },
      error: null,
      count: 0,
      status: 200,
      statusText: "ok",
    });
    const result = await upsertTournamentApplication(sampleApplication);
    expect(queries.fetchSavedApplication).toHaveBeenCalledExactlyOnceWith(
      "bf1cd522-89b1-4152-9f9a-ff426ce634a9",
      "11111111-1111-1111-1111-111111111111",
    );
    expect(result).toEqual({
      error: {
        message: "You have already applied for this tournament",
        code: ERROR_CODES.ALREADY_SUBMITTED,
      },
    });
  });
  it("returns error if checking for existing submission fails", async () => {
    vi.mocked(queries.fetchSavedApplication).mockResolvedValue(
      sampleSupabaseResponseFailure,
    );
    const result = await upsertTournamentApplication(sampleApplication);
    expect(result).toEqual({ error: sampleSupabaseAppError });
  });

  it("successfully upserts", async () => {
    const result = await upsertTournamentApplication(sampleApplication);
    expect(queries.upsertApplication).toHaveBeenCalledExactlyOnceWith({
      user_id: "11111111-1111-1111-1111-111111111111",
      tournament_id: "bf1cd522-89b1-4152-9f9a-ff426ce634a9",
      preferences: ["Anatomy and Physiology", "", "", ""],
      responses: [
        { fieldId: "b19e87ed-81eb-4b16-86c4-e7e7887e7176", response: "Hello" },
      ],
      submitted: true,
    });
    expect(result).toEqual({});
  });
  it("returns error if upsert fails", async () => {
    vi.mocked(queries.upsertApplication).mockResolvedValue(
      sampleSupabaseResponseFailure,
    );
    const result = await upsertTournamentApplication(sampleApplication);
    expect(result).toEqual({ error: sampleSupabaseAppError });
  });
});
