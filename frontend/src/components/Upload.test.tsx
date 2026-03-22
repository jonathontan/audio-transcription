import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import Upload from "./Upload";
import { MAX_FILES_LIMIT } from "../util/constant";

function createFile(filename: string, type = "audio/mpeg") {
  return new File(["mock audio content"], filename, { type });
}

describe("Upload", () => {
  test("upload single file", async () => {
    const setFiles = vi.fn();
    const onUpload = vi.fn();

    render(
      <Upload
        files={[]}
        setFiles={setFiles}
        isUploading={false}
        onUpload={onUpload}
      />,
    );

    const input: HTMLInputElement = screen.getByLabelText(/file upload/i);

    const file = createFile("Sample 1.mp3");

    await userEvent.upload(input, file);

    expect(setFiles).toHaveBeenCalledTimes(1);
    expect(input.files).toHaveLength(1);
    expect(input.files?.[0].name).toBe("Sample 1.mp3");
  });
});

describe("Upload more than max limit", () => {
  test("shows alert and prevents upload when exceeding max files limit", async () => {
    const setFiles = vi.fn();
    const onUpload = vi.fn();

    const alert = vi.spyOn(globalThis, "alert").mockImplementation(() => {});

    const file1 = createFile("Sample 1.mp3");
    const file2 = createFile("Sample 2.mp3");
    const file3 = createFile("Sample 3.mp3");
    const file4 = createFile("Sample 4.mp3");
    const files = [file1, file2, file3, file4];

    render(
      <Upload
        files={files}
        setFiles={setFiles}
        isUploading={false}
        onUpload={onUpload}
      />,
    );

    const uploadButton = screen.getByRole("button", { name: /upload/i });

    await userEvent.click(uploadButton);

    expect(alert).toHaveBeenCalledTimes(1);
    expect(alert).toHaveBeenCalledWith(
      `You have exceeded the upload limit of ${MAX_FILES_LIMIT} files.`,
    );
    expect(onUpload).not.toHaveBeenCalled();

    alert.mockRestore();
  });
});
