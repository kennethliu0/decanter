import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import sanitize from "sanitize-filename";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("image") as File;

  if (!file) {
    return NextResponse.json({ error: "No File uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${uuidv4()}_${sanitize(file.name)}`;

  const bucket = "tournament-icons";

  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      upsert: false,
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
