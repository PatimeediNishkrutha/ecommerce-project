import { render, screen, fireEvent } from "@testing-library/react";

jest.mock("react-router-dom", () => ({
  Link: ({ children }) => <span>{children}</span>,
  useNavigate: () => jest.fn(),
}));

jest.mock("../theme/ThemeToggle", () => () => (
  <button>Theme Toggle</button>
));

import Login from "../Login";

test("renders login page", () => {
  render(<Login />);

  expect(
    screen.getByText(/Welcome Back/)
  ).toBeInTheDocument();

  expect(
    screen.getByPlaceholderText(/email/i)
  ).toBeInTheDocument();

  expect(
    screen.getByPlaceholderText(/password/i)
  ).toBeInTheDocument();
});

test("allows user to enter email and password", () => {
  render(<Login />);

  const emailInput = screen.getByPlaceholderText(/email/i);
  const passwordInput = screen.getByPlaceholderText(/password/i);

  fireEvent.change(emailInput, {
    target: { value: "test@example.com" },
  });

  fireEvent.change(passwordInput, {
    target: { value: "password123" },
  });

  expect(emailInput).toHaveValue("test@example.com");
  expect(passwordInput).toHaveValue("password123");
});
