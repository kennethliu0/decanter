import { createClient } from "@/utils/supabase/server";
import sanitize from "sanitize-filename";
import { v4 as uuidv4 } from "uuid";
import { fileTypeFromBuffer } from "file-type";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("image") as File;

  if (!file) {
    return Response.json({ error: "No File uploaded" }, { status: 400 });
  }
  const fileName = `${uuidv4()}_${sanitize(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const type = await fileTypeFromBuffer(buffer);

  if (!type?.mime.startsWith("image/")) {
    return Response.json({ error: "File is not an image" }, { status: 400 });
  }
  const bucket = "tournament-icons";

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getClaims();

  if (authError || !authData?.claims) {
    return Response.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/login`);
  }

  const { error } = await supabase.storage.from(bucket).upload(fileName, file, {
    upsert: false,
    contentType: "image/*",
  });
  if (error) {
    return Response.json(
      {
        error:
          "Upload failed. Upload an image file that is less than 256 KB, or try again later.",
      },
      { status: 400 },
    );
  } else {
    return Response.json({
      url: `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/${bucket}/${fileName}`,
    });
  }
}
