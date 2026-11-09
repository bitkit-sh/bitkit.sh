import { createSubjects } from "@openauthjs/openauth/subject";
import { object, string } from "valibot";

// Shared with every service that verifies these tokens.
export const subjects = createSubjects({
  user: object({ id: string(), email: string() }),
});
