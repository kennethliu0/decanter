import { createClient } from "@/utils/supabase/server";
import { POST } from "./route";
import { Mock } from "vitest";
import { SupabaseClient } from "@supabase/supabase-js";
import { readFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";

vi.mock("uuid", () => ({
  v4: vi.fn(() => "8b9c6149-b4a8-414f-adf2-a1ccbe7ecd8f"),
}));

beforeEach(() => {
  vi.resetAllMocks();
});

function createSupabaseMock(getClaimsMock?: Mock, fileUpload?: Mock) {
  return vi.mocked(createClient).mockResolvedValue({
    auth: {
      getClaims:
        getClaimsMock
        ?? vi.fn().mockResolvedValue({
          data: {
            claims: { sub: "8b9c6149-b4a8-414f-adf2-a1ccbe7ecd8f" },
          },
        }),
    },
    storage: {
      from: vi.fn().mockReturnThis(),
      upload: fileUpload ?? vi.fn().mockResolvedValue({}),
    },
  } as unknown as SupabaseClient);
}

describe("/tournament-icons", () => {
  it("should return 200", async () => {
    createSupabaseMock();
    const imageBuffer = await readFile(
      "src/app/tournament-icons/test-icon.png",
    );
    const blob = new Blob([imageBuffer], { type: "image/png" });
    const form = new FormData();
    form.append("image", blob, "test-icon.png");

    const req = new Request(
      `${process.env.NEXT_PUBLIC_SITE_URL}/tournament-icons`,
      {
        method: "POST",
        body: form,
      },
    );

    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("should redirect to /login if not authenticated", async () => {
    createSupabaseMock(vi.fn().mockResolvedValue({ data: null }));
    const imageBuffer = await readFile(
      "src/app/tournament-icons/test-icon.png",
    );
    const blob = new Blob([imageBuffer], { type: "image/png" });
    const form = new FormData();
    form.append("image", blob, "test-icon.png");

    const req = new Request(
      `${process.env.NEXT_PUBLIC_SITE_URL}/tournament-icons`,
      {
        method: "POST",
        body: form,
      },
    );

    const res = await POST(req);
    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toBe(
      `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
    );
  });
  it("should return resource url on success", async () => {
    createSupabaseMock();
    const imageBuffer = await readFile(
      "src/app/tournament-icons/test-icon.png",
    );
    const blob = new Blob([imageBuffer], { type: "image/png" });
    const form = new FormData();
    form.append("image", blob, "test-icon.png");

    const req = new Request(
      `${process.env.NEXT_PUBLIC_SITE_URL}/tournament-icons`,
      {
        method: "POST",
        body: form,
      },
    );

    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.url).toBe(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/tournament-icons/8b9c6149-b4a8-414f-adf2-a1ccbe7ecd8f_test-icon.png`,
    );
  });

  it("should return error message when upload fails", async () => {
    createSupabaseMock(undefined, vi.fn().mockResolvedValue({ error: true }));
    const imageBuffer = await readFile(
      "src/app/tournament-icons/test-icon.png",
    );
    const blob = new Blob([imageBuffer], { type: "image/png" });
    const form = new FormData();
    form.append("image", blob, "test-icon.png");

    const req = new Request(
      `${process.env.NEXT_PUBLIC_SITE_URL}/tournament-icons`,
      {
        method: "POST",
        body: form,
      },
    );

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe(
      "Upload failed. Upload an image file that is less than 256 KB, or try again later.",
    );
  });
  it("should return error message when file is not an image", async () => {
    createSupabaseMock();
    const imageBuffer = await readFile(
      "src/app/tournament-icons/evil-test.txt",
    );
    const blob = new Blob([imageBuffer], { type: "text/plain" });
    const form = new FormData();
    form.append("image", blob, "test-icon.png");

    const req = new Request(
      `${process.env.NEXT_PUBLIC_SITE_URL}/tournament-icons`,
      {
        method: "POST",
        body: form,
      },
    );

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("File is not an image");
  });
});
