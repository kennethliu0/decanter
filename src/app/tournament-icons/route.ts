import { createClient } from "@/utils/supabase/server";
import sanitize from "sanitize-filename";
import { v4 as uuidv4 } from "uuid";
import { fileTypeFromBuffer } from "file-type";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("image") as File;
  const origin = req.headers.get("origin");
  if (origin !== process.env.NEXT_PUBLIC_SITE_URL) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  if (!file) {
    return NextResponse.json({ error: "No File uploaded" }, { status: 400 });
  }

  if (file.size > 256 * 1024) {
    return NextResponse.json(
      {
        error:
          "Upload failed. Upload an image file that is less than 256 KB, or try again later.",
      },
      { status: 400 },
    );
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const type = await fileTypeFromBuffer(buffer);

  if (!type?.mime.startsWith("image/")) {
    return NextResponse.json(
      { error: "File is not an image" },
      { status: 400 },
    );
  }
  const fileName = `${uuidv4()}.${type.ext}`;
  const bucket = "tournament-icons";

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getClaims();

  if (authError || !authData?.claims) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/login`);
  }

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, buffer, {
      upsert: false,
      contentType: type.mime,
    });
  if (error) {
    return NextResponse.json(
      {
        error:
          "Upload failed. Upload an image file that is less than 256 KB, or try again later.",
      },
      { status: 400 },
    );
  } else {
    return NextResponse.json({
      url: `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/${bucket}/${fileName}`,
    });
  }
}
