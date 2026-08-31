import { test, expect } from "@playwright/test";

test("customer portal loads successfully", async ({ page }) => {
  await page.goto("/customer");

  await expect(
    page.getByText("Your AI Telecom Assistant")
  ).toBeVisible();

  await expect(
    page.getByPlaceholder("Ask anything about telecom support...")
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: /Ask Enu/i })
  ).toBeVisible();
});
test("user can ask Enu a telecom question", async ({ page }) => {
 await page.route("**/search**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        answer: "Restart your router and check the internet connection.",
      }),
    });
  });

  await page.goto("/customer");

  const input = page.getByPlaceholder(
    "Ask anything about telecom support..."
  );

  await input.fill("My internet is slow");

  await page.getByRole("button", { name: /Ask Enu/i }).click();

  await expect(
  page.getByText(/router|internet|connection/i).first()
).toBeVisible({ timeout: 10000 });
});
