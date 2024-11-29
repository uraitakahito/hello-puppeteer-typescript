import { describe, expect, it } from "vitest";
import getTitle from "../src/title";

describe("title.mjs", () => {
  it("gets title", async () => {
    expect.assertions(1);
    await expect(getTitle("https://www.google.com")).resolves.toBe("Google");
  });
});
