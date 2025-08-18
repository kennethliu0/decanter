import { PostgrestError } from "@supabase/supabase-js";
import {
  createSupabaseMock,
  sampleSupabaseAppError,
  sampleSupabaseResponseFailure,
} from "../../tests/utils/__mocks__/supabase";
import { checkAuthReturnsError } from "../../tests/utils/authCheckTest";
import {
  getApplicationsCSV,
  getTournamentManagement,
  getTournamentsManagedByUser,
  insertTournament,
  updateTournament,
} from "./tournament-management";
import * as queries from "./tournament-management-queries";
import { ERROR_CODES, TournamentNotFoundError } from "@/lib/errors";
import { EditTournamentSchemaServer } from "@/lib/definitions";
import { infer as zodInfer } from "zod/v4";

beforeEach(() => {
  vi.resetAllMocks();
  createSupabaseMock();
  vi.spyOn(console, "error").mockImplementation(() => {});
});
vi.mock("./tournament-management-queries");

describe("getTournamentsManagedByUser", () => {
  checkAuthReturnsError(getTournamentsManagedByUser);

  it("returns tournaments", async () => {
    vi.mocked(queries.fetchManagedTournaments).mockResolvedValue({
      data: [
        {
          tournaments: [
            {
              id: "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
              name: "Test tournament",
              slug: "test-tournament",
              image_url: "https://sample.org/image.jpg",
              website_url: "https://scilympiad.com/jordan-so",
              location: "Online",
              division: "B",
              start_date: "2026-03-02",
              end_date: "2026-03-09",
              apply_deadline: "2025-12-01T05:59:59.999+00:00",
              tournament_applications: [{ count: 2 }],
            },
            {
              id: "4ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
              name: "Test tournament 2",
              slug: "test-tournament-2",
              image_url: "https://sample.org/image2.jpg",
              website_url: "https://scilympiad.com/jordan-so-2",
              location: "Texas",
              division: "C",
              start_date: "2026-03-04",
              end_date: "2026-03-05",
              apply_deadline: "2025-12-01T06:59:59.999+00:00",
              tournament_applications: [{ count: 5 }],
            },
          ],
        },
      ],
      error: null,
      count: 1,
      status: 200,
      statusText: "ok",
    });
    const result = await getTournamentsManagedByUser();
    expect(result).toEqual({
      data: [
        {
          id: "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
          name: "Test tournament",
          slug: "test-tournament",
          imageUrl: "https://sample.org/image.jpg",
          websiteUrl: "https://scilympiad.com/jordan-so",
          location: "Online",
          division: "B",
          startDate: "2026-03-02",
          endDate: "2026-03-09",
          applyDeadline: "2025-12-01T05:59:59.999+00:00",
          applicationCount: 2,
        },
        {
          id: "4ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
          name: "Test tournament 2",
          slug: "test-tournament-2",
          imageUrl: "https://sample.org/image2.jpg",
          websiteUrl: "https://scilympiad.com/jordan-so-2",
          location: "Texas",
          division: "C",
          startDate: "2026-03-04",
          endDate: "2026-03-05",
          applyDeadline: "2025-12-01T06:59:59.999+00:00",
          applicationCount: 5,
        },
      ],
    });
  });
  it("checks if fetch returned error", async () => {
    vi.mocked(queries.fetchManagedTournaments).mockResolvedValue(
      sampleSupabaseResponseFailure,
    );
    const result = await getTournamentsManagedByUser();
    expect(result).toEqual({ error: sampleSupabaseAppError });
  });

  it("checks if fetch returned no data", async () => {
    vi.mocked(queries.fetchManagedTournaments).mockResolvedValue({
      data: null,
      error: null as unknown as PostgrestError,
      count: null,
      status: 200,
      statusText: "ok",
    });
    const result = await getTournamentsManagedByUser();
    expect(result).toEqual({ data: [] });
    vi.mocked(queries.fetchManagedTournaments).mockResolvedValue({
      data: [
        {
          tournaments: null as unknown as {
            id: string;
            name: string;
            slug: string;
            image_url: string;
            website_url: string;
            location: string;
            division: string;
            start_date: string;
            end_date: string;
            apply_deadline: string;
            tournament_applications: { count: number }[];
          }[],
        },
      ],
      error: null,
      count: null,
      status: 200,
      statusText: "ok",
    });
    const result2 = await getTournamentsManagedByUser();
    expect(result2).toEqual({ data: [] });
  });
  it("checks database data validation", async () => {
    vi.mocked(queries.fetchManagedTournaments).mockResolvedValue({
      data: [
        {
          tournaments: [
            {
              id: "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
              name: "Test tournament",
              slug: "test-tournament",
              image_url: "https://sample.org/image.jpg",
              website_url: "https://scilympiad.com/jordan-so",
              location: "Online",
              division: "D",
              start_date: "2026-03-02",
              end_date: "2026-03-09",
              apply_deadline: "2025-12-01T05:59:59.999+00:00",
              tournament_applications: [{ count: 2 }],
            },
          ],
        },
      ],
      error: null,
      count: 1,
      status: 200,
      statusText: "ok",
    });
    const result = await getTournamentsManagedByUser();
    expect(result).toEqual({
      error: {
        message: "Data returned by database did not match expected shape",
        code: ERROR_CODES.SERVER_ERROR,
        status: 500,
      },
    });
  });
});
describe("getTournamentManagement", () => {
  beforeEach(() => {
    vi.mocked(queries.fetchTournamentId).mockResolvedValue({
      data: { id: "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d" },
      error: null,
      count: 1,
      status: 200,
      statusText: "ok",
    });
    vi.mocked(queries.checkUserIsTournamentAdmin).mockResolvedValue({
      data: { tournament_id: "98b0f1b2-2425-4abb-b295-b51c7c2fdd1d" },
      error: null,
      count: 1,
      status: 200,
      statusText: "ok",
    });
    vi.mocked(queries.fetchTournamentDetails).mockResolvedValue({
      data: {
        id: "98b0f1b2-2425-4abb-b295-b51c7c2fdd1d",
        name: "Test tournament",
        image_url: "https://sample.org/image.jpg",
        website_url: "https://scilympiad.com/jordan-so",
        location: "Online",
        division: "B",
        start_date: "2026-03-02",
        end_date: "2026-03-09",
        apply_deadline: "2025-12-01T05:59:59.999+00:00",
        approved: true,
        closed_early: false,
        application_fields: [
          {
            id: "7e6a63b2-43a5-49ec-9d0c-3eb28271d7e9",
            prompt: "Test field",
            type: "short",
          },
        ],
      },
      error: null,
      count: 1,
      status: 200,
      statusText: "ok",
    });
    vi.mocked(queries.fetchTournamentApplications).mockResolvedValue({
      data: [
        {
          user_id: "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
          volunteer_profiles: {
            name: "Test name",
            email: "Ht5x2@example.com",
            education: "Test education",
          } as unknown as { name: string; email: string; education: string }[],
        },
      ],
      error: null,
      count: 1,
      status: 200,
      statusText: "ok",
    });
  });
  checkAuthReturnsError(getTournamentManagement, "test-tournament");

  it("validates fields", async () => {
    const result = await getTournamentManagement(5 as unknown as string);
    expect(result).toEqual({
      error: TournamentNotFoundError,
    });
  });

  it("fetches tournamentId", async () => {
    vi.mocked(queries.fetchTournamentId).mockResolvedValueOnce(
      sampleSupabaseResponseFailure,
    );
    let result = await getTournamentManagement("test-tournament");
    expect(result).toEqual({ error: sampleSupabaseAppError });
    expect(queries.fetchTournamentId).toHaveBeenCalledExactlyOnceWith(
      "test-tournament",
    );
    vi.mocked(queries.fetchTournamentId).mockResolvedValueOnce({
      data: null,
      error: null,
      count: 0,
      status: 200,
      statusText: "ok",
    });
    result = await getTournamentManagement("test-tournament");
    expect(result).toEqual({ error: TournamentNotFoundError });
    await getTournamentManagement("test-tournament");

    expect(queries.checkUserIsTournamentAdmin).toHaveBeenCalledExactlyOnceWith(
      "11111111-1111-1111-1111-111111111111",
      "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
    );
    expect(queries.fetchTournamentDetails).toHaveBeenCalledExactlyOnceWith(
      "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
    );
  });

  it("checks if user is admin", async () => {
    vi.mocked(queries.checkUserIsTournamentAdmin).mockResolvedValueOnce(
      sampleSupabaseResponseFailure,
    );
    let result = await getTournamentManagement("test-tournament");
    expect(queries.checkUserIsTournamentAdmin).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ error: sampleSupabaseAppError });
    expect(queries.checkUserIsTournamentAdmin).toHaveBeenCalledExactlyOnceWith(
      "11111111-1111-1111-1111-111111111111",
      "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
    );
    vi.mocked(queries.checkUserIsTournamentAdmin).mockResolvedValueOnce({
      data: null,
      error: null,
      count: 0,
      status: 200,
      statusText: "ok",
    });
    result = await getTournamentManagement("test-tournament");
    expect(result).toEqual({
      error: {
        message: "You are not authorized to manage this tournament",
        code: ERROR_CODES.FORBIDDEN,
        status: 403,
      },
    });
  });

  it("fetches tournament details", async () => {
    vi.mocked(queries.fetchTournamentDetails).mockResolvedValueOnce(
      sampleSupabaseResponseFailure,
    );
    let result = await getTournamentManagement("test-tournament");
    expect(result).toEqual({ error: sampleSupabaseAppError });
    expect(queries.fetchTournamentDetails).toHaveBeenCalledTimes(1);
    vi.mocked(queries.fetchTournamentDetails).mockResolvedValueOnce({
      data: null,
      error: null,
      count: 0,
      status: 200,
      statusText: "ok",
    });
    result = await getTournamentManagement("test-tournament");
    expect(result).toEqual({ error: TournamentNotFoundError });
  });

  it("validates tournament", async () => {
    let invalidTournament = await queries.fetchTournamentDetails(
      "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
    );
    invalidTournament.data!.division = "D";
    vi.mocked(queries.fetchTournamentDetails).mockResolvedValueOnce(
      invalidTournament,
    );
    const result = await getTournamentManagement("test-tournament");
    expect(result).toEqual({
      error: {
        code: ERROR_CODES.INVALID_INPUT,
        message: "Invalid input.",
        meta: {
          issues: [{ message: "Choose a division", path: "division" }],
        },
        status: 400,
      },
    });
  });

  it("fetches tournament applications", async () => {
    vi.mocked(queries.fetchTournamentApplications).mockResolvedValueOnce(
      sampleSupabaseResponseFailure,
    );
    const result = await getTournamentManagement("test-tournament");
    expect(result).toEqual({
      error: sampleSupabaseAppError,
    });

    vi.mocked(queries.fetchTournamentApplications).mockResolvedValueOnce({
      data: null as unknown as {
        user_id: string;
        volunteer_profiles: {
          name: string;
          email: string;
          education: string;
        }[];
      }[],
      error: null,
      count: 0,
      status: 200,
      statusText: "ok",
    });

    const result2 = await getTournamentManagement("test-tournament");
    expect(result2).toEqual({
      data: {
        applications: [],
        tournament: {
          applicationFields: [
            {
              id: "7e6a63b2-43a5-49ec-9d0c-3eb28271d7e9",
              prompt: "Test field",
              type: "short",
            },
          ],
          applyDeadline: "2025-12-01T05:59:59.999+00:00",
          approved: true,
          closedEarly: false,
          division: "B",
          endDate: "2026-03-09",
          id: "98b0f1b2-2425-4abb-b295-b51c7c2fdd1d",
          imageUrl: "https://sample.org/image.jpg",
          location: "Online",
          name: "Test tournament",
          startDate: "2026-03-02",
          websiteUrl: "https://scilympiad.com/jordan-so",
        },
      },
    });
  });
  it("handles missing application data", async () => {
    vi.mocked(queries.fetchTournamentApplications).mockResolvedValueOnce({
      data: [
        {
          user_id: "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
          volunteer_profiles: [
            {
              email: "",
              name: "",
              education: "",
            },
          ],
        },
      ],
      error: null,
      count: 0,
      status: 200,
      statusText: "ok",
    });
    const result = await getTournamentManagement("test-tournament");
    expect(result).toEqual({
      data: {
        applications: [
          {
            email: "Unknown",
            id: "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
            name: "Unknown",
            education: "Unknown",
          },
        ],
        tournament: {
          applicationFields: [
            {
              id: "7e6a63b2-43a5-49ec-9d0c-3eb28271d7e9",
              prompt: "Test field",
              type: "short",
            },
          ],
          applyDeadline: "2025-12-01T05:59:59.999+00:00",
          approved: true,
          closedEarly: false,
          division: "B",
          endDate: "2026-03-09",
          id: "98b0f1b2-2425-4abb-b295-b51c7c2fdd1d",
          imageUrl: "https://sample.org/image.jpg",
          location: "Online",
          name: "Test tournament",
          startDate: "2026-03-02",
          websiteUrl: "https://scilympiad.com/jordan-so",
        },
      },
    });
  });
  it("formats return data", async () => {
    const result = await getTournamentManagement("test-tournament");
    expect(result).toEqual({
      data: {
        applications: [
          {
            education: "Test education",
            email: "Ht5x2@example.com",
            id: "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
            name: "Test name",
          },
        ],

        tournament: {
          applicationFields: [
            {
              id: "7e6a63b2-43a5-49ec-9d0c-3eb28271d7e9",
              prompt: "Test field",
              type: "short",
            },
          ],
          applyDeadline: "2025-12-01T05:59:59.999+00:00",
          approved: true,
          closedEarly: false,
          division: "B",
          endDate: "2026-03-09",
          id: "98b0f1b2-2425-4abb-b295-b51c7c2fdd1d",
          imageUrl: "https://sample.org/image.jpg",
          location: "Online",
          name: "Test tournament",
          startDate: "2026-03-02",
          websiteUrl: "https://scilympiad.com/jordan-so",
        },
      },
    });
  });
});

const updateTournamentData: Omit<
  zodInfer<typeof EditTournamentSchemaServer>,
  "id" | "approved"
> = {
  imageUrl: "https://sample.org/image.jpg",
  websiteUrl: "https://scilympiad.com/jordan-so",
  location: "Online",
  division: "B",
  startDate: "2026-03-02",
  endDate: "2026-03-09",
  applyDeadline: "2025-12-01T05:59:59.999+00:00",
  closedEarly: false,
  applicationFields: [
    {
      id: "7e6a63b2-43a5-49ec-9d0c-3eb28271d7e9",
      prompt: "Test field",
      type: "short",
    },
  ],
  name: "Test tournament",
};

describe("insertTournament", async () => {
  beforeEach(() => {
    vi.mock("uuid", () => ({
      v4: () => {
        return "98b0f1b2-2425-4abb-b295-b51c7c2fdd1d";
      },
    }));
    vi.mocked(queries.insertTournamentTable).mockResolvedValueOnce({
      error: null,
      data: null,
      count: 0,
      status: 200,
      statusText: "ok",
    });
  });

  checkAuthReturnsError(insertTournament, updateTournamentData);
  it("validates fields", async () => {
    const result = await insertTournament({
      ...updateTournamentData,
      location: "Fake location",
    });
    expect(result).toEqual({
      error: {
        code: ERROR_CODES.INVALID_INPUT,
        message: "Invalid input.",
        meta: {
          issues: [{ message: "Required field", path: "location" }],
        },
        status: 400,
      },
    });
  });
  it("calls insert tournament", async () => {
    const result = await insertTournament(updateTournamentData);
    expect(queries.insertTournamentTable).toHaveBeenCalledExactlyOnceWith({
      application_fields: [
        {
          id: "7e6a63b2-43a5-49ec-9d0c-3eb28271d7e9",
          prompt: "Test field",
          type: "short",
        },
      ],
      apply_deadline: "2025-12-01T05:59:59.999+00:00",
      closed_early: false,
      created_by: "11111111-1111-1111-1111-111111111111",
      division: "B",
      end_date: "2026-03-09",
      id: "98b0f1b2-2425-4abb-b295-b51c7c2fdd1d",
      image_url: "https://sample.org/image.jpg",
      location: "Online",
      name: "Test tournament",
      slug: "test-tournament-divb-2026-98b0f1b2",
      start_date: "2026-03-02",
      website_url: "https://scilympiad.com/jordan-so",
    });
  });
  it("handles return value of insert tournament", async () => {
    let result = await insertTournament(updateTournamentData);
    expect(result).toEqual({
      data: {
        slug: "test-tournament-divb-2026-98b0f1b2",
      },
    });
    vi.mocked(queries.insertTournamentTable).mockResolvedValueOnce(
      sampleSupabaseResponseFailure,
    );
    result = await insertTournament(updateTournamentData);
    expect(result).toEqual({
      error: sampleSupabaseAppError,
    });
  });
});

describe("updateTournament", async () => {
  beforeEach(() => {
    vi.mocked(queries.updateTournamentTable).mockResolvedValueOnce({
      error: null,
      data: null,
      count: 0,
      status: 200,
      statusText: "ok",
    });
    vi.mocked(queries.checkUserIsTournamentAdmin).mockResolvedValue({
      data: { tournament_id: "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d" },
      error: null,
      count: 1,
      status: 200,
      statusText: "ok",
    });
  });

  checkAuthReturnsError(
    updateTournament,
    "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
    updateTournamentData,
  );
  it("validates fields", async () => {
    const result = await updateTournament(
      "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
      {
        ...updateTournamentData,
        location: "Fake location",
      },
    );
    expect(result).toEqual({
      error: {
        code: ERROR_CODES.INVALID_INPUT,
        message: "Invalid input.",
        meta: {
          issues: [{ message: "Required field", path: "location" }],
        },
        status: 400,
      },
    });
    const result2 = await updateTournament("id", updateTournamentData);
    expect(result2).toEqual({
      error: {
        message: "Tournament could not be found",
        code: ERROR_CODES.NOT_FOUND,
        status: 404,
      },
    });
  });
  it("checks if user is admin", async () => {
    vi.mocked(queries.checkUserIsTournamentAdmin).mockResolvedValueOnce({
      data: null,
      error: null,
      count: 0,
      status: 200,
      statusText: "ok",
    });
    const result = await updateTournament(
      "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
      updateTournamentData,
    );
    expect(result).toEqual({
      error: {
        message: "Tournament could not be found",
        code: ERROR_CODES.NOT_FOUND,
        status: 404,
      },
    });
    vi.mocked(queries.checkUserIsTournamentAdmin).mockResolvedValueOnce(
      sampleSupabaseResponseFailure,
    );
    const result2 = await updateTournament(
      "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
      updateTournamentData,
    );
    expect(result2).toEqual({
      error: {
        message: "Tournament could not be found",
        code: ERROR_CODES.NOT_FOUND,
        status: 404,
      },
    });
  });
  it("calls update tournament", async () => {
    const result = await updateTournament(
      "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
      updateTournamentData,
    );
    expect(queries.updateTournamentTable).toHaveBeenCalledExactlyOnceWith(
      "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
      {
        application_fields: [
          {
            id: "7e6a63b2-43a5-49ec-9d0c-3eb28271d7e9",
            prompt: "Test field",
            type: "short",
          },
        ],
        apply_deadline: "2025-12-01T05:59:59.999+00:00",
        closed_early: false,
        division: "B",
        end_date: "2026-03-09",
        image_url: "https://sample.org/image.jpg",
        location: "Online",
        name: "Test tournament",
        start_date: "2026-03-02",
        website_url: "https://scilympiad.com/jordan-so",
      },
    );
  });
  it("handles return value of update tournament", async () => {
    let result = await updateTournament(
      "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
      updateTournamentData,
    );
    expect(result).toEqual({});
    vi.mocked(queries.updateTournamentTable).mockResolvedValueOnce(
      sampleSupabaseResponseFailure,
    );
    result = await updateTournament(
      "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
      updateTournamentData,
    );
    expect(result).toEqual({
      error: sampleSupabaseAppError,
    });
  });
});

describe("getApplicationsCSV", () => {
  beforeEach(() => {
    vi.mocked(queries.getTournamentWithFieldsBySlug).mockResolvedValue({
      data: {
        id: "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
        application_fields: [
          {
            id: "7e6a63b2-43a5-49ec-9d0c-3eb28271d7e9",
            prompt: "Test field",
            type: "short",
          },
        ],
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
    vi.mocked(queries.fetchTournamentApplicationsFull).mockResolvedValue({
      data: [
        {
          user_id: "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
          volunteer_profiles: {
            name: "Test name",
            email: "Ht5x2@example.com",
            education: "Test education",
            bio: "Test bio",
            experience: "Test experience",
          } as unknown as {
            name: string;
            email: string;
            education: string;
            bio: string;
            experience: string;
          }[],
          preferences: ["Anatomy and Physiology", "", "", ""],
          responses: [
            {
              fieldId: "7e6a63b2-43a5-49ec-9d0c-3eb28271d7e9",
              response: "Test response",
            },
          ],
          updated_at: "2025-12-01T05:59:59.999+00:00",
        },
      ],
      error: null,
      count: 1,
      status: 200,
      statusText: "ok",
    });
  });

  checkAuthReturnsError(getApplicationsCSV, "tournament-slug");
  it("validates fields", async () => {
    const result = await getApplicationsCSV(5 as unknown as string);
    expect(result).toEqual({
      error: {
        code: ERROR_CODES.NOT_FOUND,
        message: "Tournament could not be found",
        status: 404,
      },
    });
  });

  it("fetches tournament id and fields", async () => {
    vi.mocked(queries.getTournamentWithFieldsBySlug).mockResolvedValueOnce(
      sampleSupabaseResponseFailure,
    );
    let result = await getApplicationsCSV("tournament-slug");
    expect(result).toEqual({
      error: sampleSupabaseAppError,
    });
    expect(
      queries.getTournamentWithFieldsBySlug,
    ).toHaveBeenCalledExactlyOnceWith("tournament-slug");
    vi.mocked(queries.getTournamentWithFieldsBySlug).mockResolvedValueOnce({
      data: null,
      error: null,
      count: 0,
      status: 200,
      statusText: "ok",
    });
    result = await getApplicationsCSV("tournament-slug");
    expect(result).toEqual({ error: TournamentNotFoundError });
    await getApplicationsCSV("tournament-slug");
  });

  it("checks if user is admin", async () => {
    vi.mocked(queries.checkUserIsTournamentAdmin).mockResolvedValueOnce({
      data: null,
      error: null,
      count: 0,
      status: 200,
      statusText: "ok",
    });
    const result = await getApplicationsCSV("tournament-slug");
    expect(result).toEqual({
      error: {
        message: "Unauthorized access",
        code: ERROR_CODES.UNAUTHORIZED,
        status: 401,
      },
    });
    vi.mocked(queries.checkUserIsTournamentAdmin).mockResolvedValueOnce(
      sampleSupabaseResponseFailure,
    );
    const result2 = await getApplicationsCSV("tournament-slug");
    expect(result2).toEqual({
      error: {
        message: "Unauthorized access",
        code: ERROR_CODES.UNAUTHORIZED,
        status: 401,
      },
    });
  });

  it("fetches applications", async () => {
    vi.mocked(queries.fetchTournamentApplicationsFull).mockResolvedValueOnce(
      sampleSupabaseResponseFailure,
    );
    const result = await getApplicationsCSV("tournament-slug");
    expect(result).toEqual({
      error: sampleSupabaseAppError,
    });
    expect(
      queries.fetchTournamentApplicationsFull,
    ).toHaveBeenCalledExactlyOnceWith("3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d");
  });

  it("returns csv", async () => {
    const result = await getApplicationsCSV("tournament-slug");
    expect(result).toEqual({
      data: `"Timestamp","Email","Name","Education","Bio","First Preference","Second Preference","Third Preference","Fourth Preference","Experience","Test field"
"11/30/2025, 11:59:59 PM CST","Ht5x2@example.com","Test name","Test education","Test bio","Anatomy and Physiology","","","","Test experience","Test response"`,
    });
  });

  it("cleans application data", async () => {
    let sampleApplicationData = await queries.fetchTournamentApplicationsFull(
      "3ab0f1b2-2425-4abb-b295-b51c7c2fdd1d",
    );
    sampleApplicationData.data![0].volunteer_profiles = {
      name: null,
      email: "Ht5x2@example.com",
      education: "Test education",
      bio: "Test bio",
      experience: "Test experience",
    } as unknown as {
      name: string;
      email: string;
      education: string;
      bio: string;
      experience: string;
    }[];
    vi.mocked(queries.fetchTournamentApplicationsFull).mockResolvedValueOnce(
      sampleApplicationData,
    );
    const result = await getApplicationsCSV("tournament-slug");
    expect(result).toEqual({
      data: `"Timestamp","Email","Name","Education","Bio","First Preference","Second Preference","Third Preference","Fourth Preference","Experience","Test field"
"11/30/2025, 11:59:59 PM CST","Ht5x2@example.com","","Test education","Test bio","Anatomy and Physiology","","","","Test experience","Test response"`,
    });
  });
});
