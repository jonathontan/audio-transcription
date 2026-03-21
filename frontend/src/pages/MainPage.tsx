import { useEffect, useState } from "react";
import Connection from "../components/Connection";
import NavigationTab from "../components/NavigationTab";
import TranscriptionTable from "../components/TranscriptionTable";
import Upload from "../components/Upload";
import { type Transcription } from "../interfaces/transcription";
import {
  getTranscriptions,
  transcribe,
} from "../services/transcriptionService";
import styles from "./MainPage.module.css";

function MainPage() {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [files, setFiles] = useState<File[]>([]);
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [initialTranscriptions, setInitialTranscriptions] = useState<
    Transcription[]
  >([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => fetchTranscriptions(), 2000);
  }, []);

  const fetchTranscriptions = async () => {
    try {
      const response = await getTranscriptions();
      setTranscriptions(response);
      setInitialTranscriptions(response);
    } catch (e: unknown) {
      if (e instanceof Error) throw new Error(e.message);
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);
    const success: { data: Transcription; file: File }[] = [];
    const error: { reason: string; file: File }[] = [];

    try {
      for (const file of files) {
        try {
          const response = await transcribe(file);
          success.push({ data: response, file });
        } catch (err: unknown) {
          error.push({
            reason: err instanceof Error ? err.message : "Upload failed",
            file,
          });
        }
      }

      if (success.length > 0) {
        fetchTranscriptions();
        success.forEach((res) =>
          alert(`Successfully transcribed ${res.data.filename}.`),
        );
      }

      if (error.length > 0) {
        error.forEach((err) =>
          alert(`
          Error uploading ${err.file.name}
          Reason: ${err.reason}`),
        );
      }
    } finally {
      setIsUploading(false);
      setFiles([]);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Audio Transcription</h1>
      <Connection />
      <div className={styles.tabNavigation}>
        <NavigationTab tabIndex={tabIndex} onChange={setTabIndex} />
      </div>
      <div className={styles.tabContent}>
        {tabIndex === 0 && (
          <Upload
            files={files}
            setFiles={setFiles}
            isUploading={isUploading}
            onUpload={handleUpload}
          />
        )}
        {tabIndex === 1 && (
          <TranscriptionTable
            transcriptions={transcriptions}
            initialTranscriptions={initialTranscriptions}
            setTranscriptions={setTranscriptions}
          />
        )}
      </div>
    </div>
  );
}

export default MainPage;
