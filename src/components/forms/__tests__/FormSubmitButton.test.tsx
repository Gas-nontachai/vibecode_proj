import { render, screen } from "@testing-library/react";
import { FormSubmitButton } from "../FormSubmitButton";

jest.mock("react-dom", () => {
  const actual = jest.requireActual("react-dom");
  return {
    ...actual,
    useFormStatus: jest.fn(),
  };
});

const useFormStatus = jest.mocked(jest.requireMock("react-dom").useFormStatus);

describe("FormSubmitButton", () => {
  beforeEach(() => {
    useFormStatus.mockReturnValue({
      pending: false,
      data: null,
      method: null,
      action: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the idle text when the form is not pending", () => {
    render(
      <FormSubmitButton idleText="Submit" pendingText="Submitting..." className="extra-class" />,
    );

    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("extra-class");
    expect(button).not.toBeDisabled();
  });

  it("renders the pending text and disables the button when pending", () => {
    useFormStatus.mockReturnValue({
      pending: true,
      data: null,
      method: null,
      action: null,
    });

    render(<FormSubmitButton idleText="Submit" pendingText="Submitting..." />);

    const button = screen.getByRole("button", { name: "Submitting..." });
    expect(button).toBeDisabled();
  });
});
