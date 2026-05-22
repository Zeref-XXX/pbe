import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import App from "./App";

vi.mock("./common/helpers/Api", () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: [] }),
    post: vi.fn().mockResolvedValue({ data: {} }),
    setAuthToken: vi.fn(),
  },
}));

test("renders app without crashing", () => {
  render(<App />);
});

test("shows products page when authenticated", async () => {
  render(<App />);

  const heading = await screen.findByText(/Login to your account/);

  expect(heading).toBeInTheDocument();
});