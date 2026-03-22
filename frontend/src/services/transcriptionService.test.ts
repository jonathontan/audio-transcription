import { describe, expect, test, vi } from "vitest";
import type { Transcription } from "../interfaces/transcription";
import { getTranscriptions, transcribe } from "./transcriptionService";

describe("transcriptionService", () => {
  test("getTranscriptions fetch all transcriptions", async () => {
    const mockResponse = [
      {
        id: 1,
        filename: "Sample 1.mp3",
        filepath: "uploads/Sample 1.mp3",
        transcript: "This is sample 1.",
        created_at: "2026-03-19T10:14:01",
      },
      {
        id: 2,
        filename: "Sample 2.mp3",
        filepath: "uploads/Sample 2.mp3",
        transcript: "This is sample 2.",
        created_at: "2026-03-19T10:14:01",
      },
      {
        id: 3,
        filename: "Sample 3.mp3",
        filepath: "uploads/Sample 3.mp3",
        transcript: "This is sample 3.",
        created_at: "2026-03-19T10:14:01",
      },
    ];

    globalThis.fetch = vi.fn<typeof fetch>(() => {
      return Promise.resolve({
        json: () => Promise.resolve(mockResponse),
        ok: true,
        status: 200,
      } as Response);
    });

    const response = await getTranscriptions();

    expect(response).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test("transcribe sends formData and return response", async () => {
    const mockResponse = {
      id: 1,
      filename: "Sample 1.mp3",
      filepath: "uploads/Sample 1.mp3",
      transcript: "This is sample 1.",
      created_at: "2026-03-19T10:14:01",
    };

    const mockFetch = (globalThis.fetch = vi.fn<typeof fetch>(() => {
      return Promise.resolve({
        json: () => Promise.resolve(mockResponse),
        ok: true,
        status: 200,
      } as Response);
    }));

    const file = new File(["mock file"], "sample 1", { type: "audio/mpeg" });
    const response = await transcribe(file) as Transcription[];

    expect(response).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/transcribe"),
      expect.objectContaining({
        method: "POST",
        body: expect.any(FormData),
      }),
    );
  });

  test("transcribe throws error", async () => {
    const mockResponse = {
      detail: "Error: 400: File exceeds limit. Maximum size is 1MB",
    };

    globalThis.fetch = vi.fn<typeof fetch>(() => {
      return Promise.resolve({
        json: () => Promise.resolve(mockResponse),
        ok: false,
        status: 500,
      } as Response);
    });

    const file = new File(["mock file"], "sample 1.mp3", {
      type: "audio/mpeg",
    });
    
    await expect(transcribe(file)).rejects.toThrow(
      "Error: 400: File exceeds limit. Maximum size is 1MB",
    );
  });
});
