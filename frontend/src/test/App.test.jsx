import { afterEach, describe, expect, test, vi } from "vitest"; import { cleanup, render, screen } from "@testing-library/react"; import userEvent from "@testing-library/user-event"; import axios from "axios"; import App from "../App";
vi.mock("axios", () => ({ default: { get: vi.fn(), post: vi.fn(), }, }));
afterEach(() => { cleanup(); vi.clearAllMocks(); });
describe("App", () => { test("renders the Enu telecom assistant homepage", () => { render(<App />);
expect(
  screen.getByText("Your AI Telecom Assistant")
).toBeInTheDocument();

expect(
  screen.getByRole("button", { name: /Ask Enu/i })
).toBeInTheDocument();

expect(
  screen.getByText("Popular Questions")
).toBeInTheDocument();
});
test("allows a user to ask Enu a telecom question", async () => { axios.get.mockResolvedValueOnce({ data: { answer: "Restart your router and check the internet connection.", }, });
const user = userEvent.setup();

render(<App />);

const input = screen.getByPlaceholderText(
  "Ask anything about telecom support..."
);

await user.type(input, "My internet is slow");

await user.click(
  screen.getByRole("button", { name: /Ask Enu/i })
);

expect(axios.get).toHaveBeenCalled();

expect(
  await screen.findByText(
    "Restart your router and check the internet connection."
  )
).toBeInTheDocument();
}); });