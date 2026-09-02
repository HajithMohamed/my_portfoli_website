import { expect, test } from "@playwright/test";

test("homepage renders primary portfolio sections", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Full Stack Developer Building Modern Web Platforms" })).toBeVisible();
  await expect(page.getByText("What I Build")).toBeVisible();
  await expect(page.getByText("GitHub Intelligence")).toBeVisible();
  await expect(page.getByRole("link", { name: "Admin" })).toBeVisible();
});
