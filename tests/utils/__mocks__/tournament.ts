import { infer as zodInfer } from "zod/v4";
import { EditTournamentSchemaServer } from "@/lib/definitions";
import { toSnake } from "@/lib/utils";
export const sampleTournament: zodInfer<typeof EditTournamentSchemaServer> = {
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

export const sampleTournamentSnake = {
  image_url: "https://example.com/image.jpg",
  website_url: "https://example.com",
  name: "Example Tournament",
  location: "Online",
  division: "B",
  closed_early: false,
  application_fields: [
    {
      prompt: "Field 1",
      type: "short",
      id: "b19e87ed-81eb-4b16-86c4-e7e7887e7176",
    },
  ],
  start_date: "2025-03-01",
  end_date: "2025-03-31",
  apply_deadline: "2025-02-15T12:00:00.000Z",
  approved: false,
  id: "bf1cd522-89b1-4152-9f9a-ff426ce634a9",
};
