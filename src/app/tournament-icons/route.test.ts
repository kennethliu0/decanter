import { createClient } from "@/utils/supabase/server";
import { POST } from "./route";
import { Mock } from "vitest";
import { SupabaseClient } from "@supabase/supabase-js";
import { readFile } from "fs/promises";
import { NextRequest } from "next/server";

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

const imageBuffer = await readFile("src/app/tournament-icons/test-icon.png");
const blob = new Blob([imageBuffer], { type: "image/png" });
const form = new FormData();
form.append("image", blob, "test-icon.png");

describe("/tournament-icons", () => {
  it("returns 200", async () => {
    createSupabaseMock();

    const req = new NextRequest(
      `${process.env.NEXT_PUBLIC_SITE_URL}/tournament-icons`,
      {
        method: "POST",
        body: form,
        headers: {
          Origin: process.env.NEXT_PUBLIC_SITE_URL!,
        },
      },
    );

    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("calls Supabase", async () => {
    const createClientMock = vi.fn().mockResolvedValue({
      data: {
        claims: { sub: "8b9c6149-b4a8-414f-adf2-a1ccbe7ecd8f" },
      },
    });
    const fileUploadMock = vi.fn().mockResolvedValue({ error: null });
    createSupabaseMock(createClientMock, fileUploadMock);

    const req = new NextRequest(
      `${process.env.NEXT_PUBLIC_SITE_URL}/tournament-icons`,
      {
        method: "POST",
        body: form,
        headers: {
          Origin: process.env.NEXT_PUBLIC_SITE_URL!,
        },
      },
    );

    await POST(req);
    expect(createClientMock).toHaveBeenCalledTimes(1);
    expect(fileUploadMock).toHaveBeenCalledTimes(1);
  });
  it("redirects to /login if not authenticated", async () => {
    createSupabaseMock(vi.fn().mockResolvedValue({ data: null }));

    const req = new NextRequest(
      `${process.env.NEXT_PUBLIC_SITE_URL}/tournament-icons`,
      {
        method: "POST",
        body: form,
        headers: {
          Origin: process.env.NEXT_PUBLIC_SITE_URL!,
        },
      },
    );

    const res = await POST(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("Location")).toBe(
      `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
    );
  });
  it("returns resource url on success", async () => {
    createSupabaseMock();

    const req = new NextRequest(
      `${process.env.NEXT_PUBLIC_SITE_URL}/tournament-icons`,
      {
        method: "POST",
        body: form,
        headers: {
          Origin: process.env.NEXT_PUBLIC_SITE_URL!,
        },
      },
    );

    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.url).toBe(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/tournament-icons/8b9c6149-b4a8-414f-adf2-a1ccbe7ecd8f.png`,
    );
  });

  it("returns error message when upload fails", async () => {
    createSupabaseMock(undefined, vi.fn().mockResolvedValue({ error: true }));

    const req = new NextRequest(
      `${process.env.NEXT_PUBLIC_SITE_URL}/tournament-icons`,
      {
        method: "POST",
        body: form,
        headers: {
          Origin: process.env.NEXT_PUBLIC_SITE_URL!,
        },
      },
    );
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe(
      "Upload failed. Upload an image file that is less than 256 KB, or try again later.",
    );
  });
  it("returns error message when file is not an image", async () => {
    createSupabaseMock();
    const imageBuffer = await readFile(
      "src/app/tournament-icons/evil-test.txt",
    );
    const blob = new Blob([imageBuffer], { type: "text/plain" });
    const form = new FormData();
    form.append("image", blob, "test-icon.png");

    const req = new NextRequest(
      `${process.env.NEXT_PUBLIC_SITE_URL}/tournament-icons`,
      {
        method: "POST",
        body: form,
        headers: {
          Origin: process.env.NEXT_PUBLIC_SITE_URL!,
        },
      },
    );

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("File is not an image");
  });
  it("returns error message when file is too large", async () => {
    createSupabaseMock();
    const largeBuffer = new Uint8Array(300 * 1024).fill(1);
    const blob = new Blob([largeBuffer], { type: "image/png" });
    const form = new FormData();
    form.append("image", blob, "test-icon.png");

    const req = new NextRequest(
      `${process.env.NEXT_PUBLIC_SITE_URL}/tournament-icons`,
      {
        method: "POST",
        body: form,
        headers: {
          Origin: process.env.NEXT_PUBLIC_SITE_URL!,
        },
      },
    );

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe(
      "Upload failed. Upload an image file that is less than 256 KB, or try again later.",
    );
  });
  it("checks headers origin", async () => {
    const req = new NextRequest(
      `${process.env.NEXT_PUBLIC_SITE_URL}/tournament-icons`,
      {
        method: "POST",
        body: form,
        headers: {
          Origin: "https://not-allowed.com",
        },
      },
    );
    const res = await POST(req);
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: "Invalid origin" });
  });
  it("returns if no file is attached", async () => {
    const formData = new FormData();
    const req = new NextRequest(
      `${process.env.NEXT_PUBLIC_SITE_URL}/tournament-icons`,
      {
        method: "POST",
        headers: {
          Origin: process.env.NEXT_PUBLIC_SITE_URL!,
        },
        body: formData,
      },
    );
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "No File uploaded" });
  });
});
