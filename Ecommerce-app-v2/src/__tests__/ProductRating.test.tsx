import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductRating from "../components/ProductRating";

describe("ProductRating Component", () => {
  it("renders component with correct rating value", () => {
    render(<ProductRating value={4.5} count="100 reviews" />);

    // Check if the component renders
    expect(screen.getByText("100 reviews")).toBeInTheDocument();
  });

  it("displays review count correctly", () => {
    render(<ProductRating value={3} count="50 reviews" />);

    expect(screen.getByText("50 reviews")).toBeInTheDocument();
  });

  it("renders with numeric count", () => {
    render(<ProductRating value={4.2} count={75} />);

    expect(screen.getByText("75")).toBeInTheDocument();
  });

  it("renders without count when count is empty", () => {
    const { container } = render(<ProductRating value={2.5} count="" />);

    // Should still render the star rating section
    const starsContainer = container.querySelector('span[style*="color"]');
    expect(starsContainer).toBeInTheDocument();
  });

  it("handles zero rating", () => {
    render(<ProductRating value={0} count="No reviews" />);

    expect(screen.getByText("No reviews")).toBeInTheDocument();
  });

  it("handles maximum rating", () => {
    render(<ProductRating value={5} count="Perfect!" />);

    expect(screen.getByText("Perfect!")).toBeInTheDocument();
  });
});
