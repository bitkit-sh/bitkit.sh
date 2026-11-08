// Runs under bun test and Vitest.
import { expect, test } from "vitest";
import kit from "../bitkit.kit.json";

test("kit uses schema bitkit.kit/v1", () => {
  expect(kit.schema).toBe("bitkit.kit/v1");
});

test("every bio fits its platform", () => {
  for (const p of kit.platforms) expect(p.bio.length).toBeLessThanOrEqual(p.bioLimit);
});
