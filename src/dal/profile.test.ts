import { VolunteerProfileSchema } from "@/lib/definitions";
import { createClient } from "@/utils/supabase/server";
import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { Mock } from "vitest";
import { infer as zodInfer } from "zod/v4";
import { getEventPreferences, getProfile, upsertProfile } from "./profile";
import { ERROR_CODES } from "@/lib/errors";
import { checkAuthReturnsError } from "../../tests/utils/authCheckTest";
import { mockedFrom } from "../../tests/utils/__mocks__/supabase";

vi.mock("server-only", () => {
  return {
    // mock server only
  };
});

function createSupabaseMock(getClaimsMock?: Mock, tableFromMock?: Mock) {
  return vi.mocked(createClient).mockResolvedValue({
    auth: {
      getClaims:
        getClaimsMock
        ?? vi.fn().mockResolvedValue({
          data: {
            claims: {
              sub: "52fd16f1-16d9-4ce2-a502-d0212a050cf1",
              email: "bUWkP@example.com",
            },
          },
        }),
    },
    from: tableFromMock ?? vi.fn().mockReturnThis(),
  } as unknown as SupabaseClient);
}

beforeEach(() => {
  vi.resetAllMocks();
});

const sampleProfile: zodInfer<typeof VolunteerProfileSchema> = {
  name: "John Doe",
  education: "MIT '23",
  bio: "I'm a person",
  experience: "I have experience",
  preferencesB: ["Anatomy and Physiology", "", "", ""],
  preferencesC: ["Anatomy and Physiology", "", "", ""],
};
const sampleProfileServer = {
  name: sampleProfile.name,
  education: sampleProfile.education,
  bio: sampleProfile.bio,
  experience: sampleProfile.experience,
  preferences_b: sampleProfile.preferencesB,
  preferences_c: sampleProfile.preferencesC,
};

describe("upsertProfile", () => {
  it("validates form fields", async () => {
    createSupabaseMock();
    const incorrectFields = { ...sampleProfile, name: "John" };
    const result = await upsertProfile(incorrectFields);
    expect(result).toEqual({
      error: {
        code: ERROR_CODES.INVALID_INPUT,
        message: "Invalid input.",
        meta: {
          issues: [
            {
              message: "Include first and last name",
              path: "name",
            },
          ],
        },
        status: 400,
      },
    });
    expect(createClient).not.toHaveBeenCalled();
  });
  checkAuthReturnsError(upsertProfile, sampleProfile);

  it("upserts volunteer_profiles table", async () => {
    const upsertMock = vi.fn(() => ({
      error: null,
    }));
    const fromMock = vi.fn((key) => {
      return key === "volunteer_profiles" ?
          {
            upsert: upsertMock,
          }
        : {};
    });
    const supabase = createSupabaseMock(undefined, fromMock);
    await upsertProfile(sampleProfile);
    expect(supabase).toHaveBeenCalledTimes(1);
    expect(upsertMock).toHaveBeenCalledExactlyOnceWith({
      id: "52fd16f1-16d9-4ce2-a502-d0212a050cf1",
      email: "bUWkP@example.com",
      ...sampleProfileServer,
    });
  });
  it("returns error when upsert fails", async () => {
    const upsertMock = vi.fn(() => ({
      error: new PostgrestError({
        message: "message",
        details: "details",
        hint: "hint",
        code: "23501",
      }),
    }));
    const fromMock = vi.fn((key) => {
      return key === "volunteer_profiles" ?
          {
            upsert: upsertMock,
          }
        : {};
    });
    createSupabaseMock(undefined, fromMock);
    using spy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await upsertProfile(sampleProfile);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      error: {
        message: "A database error occurred.",
        code: ERROR_CODES.SERVER_ERROR,
        status: 500,
        name: "PostgrestError",
        meta: {
          code: "23501",
          details: "details",
          hint: "hint",
        },
      },
    });
  });
});

describe("getProfile", () => {
  checkAuthReturnsError(getProfile);

  it("calls Supabase functions with filters", async () => {
    const supabase = createSupabaseMock(undefined, mockedFrom);
    const result = await getProfile();

    expect(supabase).toHaveBeenCalledTimes(1);
    const mockInstance = mockedFrom.mock.results[0].value;
    expect(mockedFrom).toHaveBeenCalledExactlyOnceWith("volunteer_profiles");
    expect(mockInstance.select).toHaveBeenCalledExactlyOnceWith(
      "name, education, bio, experience, preferences_b, preferences_c",
    );
    expect(mockInstance.eq).toHaveBeenCalledExactlyOnceWith(
      "id",
      "52fd16f1-16d9-4ce2-a502-d0212a050cf1",
    );
    expect(mockInstance.maybeSingle).toHaveBeenCalledTimes(1);

    expect(result).toEqual({});
  });

  it("returns error when Supabase returns error", async () => {
    createSupabaseMock(
      undefined,
      vi.fn(() => ({
        select: () => ({
          eq: () => ({
            maybeSingle: () => ({
              error: new PostgrestError({
                message: "message",
                details: "details",
                hint: "hint",
                code: "23501",
              }),
            }),
          }),
        }),
      })),
    );
    using spy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await getProfile();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      error: {
        message: "A database error occurred.",
        code: ERROR_CODES.SERVER_ERROR,
        status: 500,
        name: "PostgrestError",
        meta: {
          code: "23501",
          details: "details",
          hint: "hint",
        },
      },
    });
  });

  it("returns database data", async () => {
    createSupabaseMock(
      undefined,
      vi.fn(() => ({
        select: () => ({
          eq: () => ({
            maybeSingle: () => ({
              data: sampleProfileServer,
            }),
          }),
        }),
      })),
    );

    const result = await getProfile();
    expect(result).toEqual({
      data: {
        profile: sampleProfile,
      },
    });
  });

  it("validates database data", async () => {
    createSupabaseMock(
      undefined,
      vi.fn(() => ({
        select: () => ({
          eq: () => ({
            maybeSingle: () => ({
              data: { ...sampleProfileServer, name: "John" },
            }),
          }),
        }),
      })),
    );

    const result = await getProfile();
    expect(result).toEqual({
      error: {
        code: ERROR_CODES.INVALID_INPUT,
        message: "Invalid input.",
        meta: {
          issues: [
            {
              message: "Include first and last name",
              path: "name",
            },
          ],
        },
        status: 400,
      },
    });
  });
});

describe("getEventPreferences", () => {
  checkAuthReturnsError(getEventPreferences);

  it("calls Supabase functions with filters", async () => {
    const supabase = createSupabaseMock(undefined, mockedFrom);
    await getEventPreferences();
    expect(supabase).toHaveBeenCalledTimes(1);
    const mockInstance = mockedFrom.mock.results[0].value;
    expect(mockedFrom).toHaveBeenCalledExactlyOnceWith("volunteer_profiles");
    expect(mockInstance.select).toHaveBeenCalledExactlyOnceWith(
      "preferences_b, preferences_c",
    );
    expect(mockInstance.eq).toHaveBeenCalledExactlyOnceWith(
      "id",
      "52fd16f1-16d9-4ce2-a502-d0212a050cf1",
    );
    expect(mockInstance.maybeSingle).toHaveBeenCalledTimes(1);
  });

  it("returns database data", async () => {
    createSupabaseMock(
      undefined,
      vi.fn(() => ({
        select: () => ({
          eq: () => ({
            maybeSingle: () => ({
              data: {
                preferences_b: sampleProfileServer.preferences_b,
                preferences_c: sampleProfileServer.preferences_c,
              },
            }),
          }),
        }),
      })),
    );

    const result = await getEventPreferences();
    expect(result).toEqual({
      data: {
        preferencesB: sampleProfileServer.preferences_b,
        preferencesC: sampleProfileServer.preferences_c,
      },
    });
  });

  it("checks if user has a volunteer profile", async () => {
    createSupabaseMock(
      undefined,
      vi.fn(() => ({
        select: () => ({
          eq: () => ({
            maybeSingle: () => ({
              data: null,
            }),
          }),
        }),
      })),
    );

    const result = await getEventPreferences();
    expect(result).toEqual({
      error: {
        code: ERROR_CODES.VOLUNTEER_PROFILE_NOT_FOUND,
        message: "Please create a volunteer profile before applying.",
        status: 404,
      },
    });
  });

  it("validates database data", async () => {
    createSupabaseMock(
      undefined,
      vi.fn(() => ({
        select: () => ({
          eq: () => ({
            maybeSingle: () => ({
              data: {
                preferences_b: ["Not an event", "", "", ""],
                preferences_c: sampleProfileServer.preferences_c,
              },
            }),
          }),
        }),
      })),
    );
    using spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await getEventPreferences();
    expect(result).toEqual({
      error: {
        code: ERROR_CODES.INVALID_REFERENCE,
        message: "Invalid output from database.",
        status: 400,
      },
    });
    expect(spy).toHaveBeenCalledExactlyOnceWith(
      "Invalid database output for event preferences.",
    );
  });

  it("returns error when Supabase returns error", async () => {
    createSupabaseMock(
      undefined,
      vi.fn(() => ({
        select: () => ({
          eq: () => ({
            maybeSingle: () => ({
              error: new PostgrestError({
                message: "message",
                details: "details",
                hint: "hint",
                code: "23501",
              }),
            }),
          }),
        }),
      })),
    );
    using spy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await getEventPreferences();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      error: {
        message: "A database error occurred.",
        code: ERROR_CODES.SERVER_ERROR,
        status: 500,
        name: "PostgrestError",
        meta: {
          code: "23501",
          details: "details",
          hint: "hint",
        },
      },
    });
  });
});
