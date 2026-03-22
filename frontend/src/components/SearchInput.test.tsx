import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import SearchInput from "./SearchInput";

describe("SearchInput", () => {
  test("update text when typing", async () => {
    const setSearchText = vi.fn();
    const onSearch = vi.fn();

    render(
      <SearchInput
        searchText=""
        setSearchText={setSearchText}
        onSearch={onSearch}
      />,
    );

    const input: HTMLElement = screen.getByPlaceholderText(/search.../i);

    await userEvent.type(input, "sample");

    expect(setSearchText).toHaveBeenCalled();
    expect(setSearchText).toHaveBeenLastCalledWith("sample");
  });

  test("trigger onSearch when search button is clicked", async () => {
    const setSearchText = vi.fn();
    const onSearch = vi.fn();

    render(
      <SearchInput
        searchText="sample"
        setSearchText={setSearchText}
        onSearch={onSearch}
      />,
    );

    const button = screen.getByRole("button", { name: /search/i });

    await userEvent.click(button);

    expect(onSearch).toHaveBeenCalledTimes(1);
  });
});
