import { useState } from "react";
import NavigationTab from "../components/NavigationTab";
import Upload from "../components/Upload";
import styles from "./MainPage.module.css";
import uploadFile from "../services/transcriptionService";
import { type Transcription } from "../interfaces/transcription";

function MainPage() {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleUpload = async () => {
    setIsUploading(true);
    const success: { data: Transcription; file: File }[] = [];
    const error: { reason: string; file: File }[] = [];

    try {
      for (const file of files) {
        try {
          const response = await uploadFile(file);
          success.push({ data: response, file });
        } catch (err: unknown) {
          error.push({
            reason: err instanceof Error ? err.message : "Upload failed",
            file,
          });
        }
      }
      if (success.length > 0)
        success.map((res) =>
          alert(`Successfully transcribed ${res.data.filename}.`),
        );

      if (error.length > 0) {
        error.map((err) =>
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
      </div>
    </div>
  );
}

export default MainPage;
