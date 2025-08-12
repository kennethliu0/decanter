import { upsertProfile } from "@/dal/profile";
import { upsertProfileAction } from "./volunteer-profiles";
import { infer as zodInfer } from "zod/v4";
import { VolunteerProfileSchema } from "@/lib/definitions";
import {
  AppAuthError,
  ERROR_CODES,
  TournamentNotFoundError,
} from "@/lib/errors";
import { redirect } from "next/navigation";

vi.mock("next/navigation");
vi.mock("@/dal/profile");

beforeEach(() => {
  vi.resetAllMocks();
});

describe("upsertVolunteerProfileAction", () => {
  const sampleProfile: zodInfer<typeof VolunteerProfileSchema> = {
    name: "John Doe",
    education: "MIT '23",
    bio: "I'm a person",
    experience: "I have experience",
    preferencesB: ["Anatomy and Physiology", "", "", ""],
    preferencesC: ["Anatomy and Physiology", "", "", ""],
  };

  it("validates user inputs", async () => {
    const invalidProfile = {
      ...sampleProfile,
      name: "John",
    };
    const result = await upsertProfileAction(undefined, invalidProfile);
    expect(upsertProfile).not.toHaveBeenCalled();
    expect(result.errors).toEqual({ name: ["Include first and last name"] });
    expect(result.success).toBe(false);
  });

  it("returns success message", async () => {
    vi.mocked(upsertProfile).mockResolvedValue({});
    const result = await upsertProfileAction(undefined, sampleProfile);
    expect(result.success).toBe(true);
  });

  it("calls upsertProfile", async () => {
    vi.mocked(upsertProfile).mockResolvedValue({});
    await upsertProfileAction(undefined, sampleProfile);
    expect(upsertProfile).toHaveBeenCalledTimes(1);
    expect(upsertProfile).toHaveBeenCalledWith(sampleProfile);
  });

  it("redirects to login page if unauthenticated", async () => {
    vi.mocked(upsertProfile).mockResolvedValue({ error: AppAuthError });
    await upsertProfileAction(undefined, sampleProfile);
    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith("/login");
  });

  it("returns error message", async () => {
    vi.mocked(upsertProfile).mockResolvedValue({
      error: {
        message: "Misc. error",
        code: ERROR_CODES.UNKNOWN,
      },
    });
    const result = await upsertProfileAction(undefined, sampleProfile);
    expect(result.success).toBe(false);
    expect(result.message).toBe("Misc. error");
  });
});
