import { Icon } from "@iconify/react";
import { Button, Fade, IconButton } from "@mui/material";
import {
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type DragEvent,
  type SetStateAction,
} from "react";
import colors from "../styles/colors";
import { MAX_FILES_LIMIT } from "../util/constant";
import styles from "./Upload.module.css";

interface Props {
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
  isUploading: boolean;
  onUpload: () => void;
}

function Upload({ files, setFiles, isUploading, onUpload }: Readonly<Props>) {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isMouseOver, setIsMouseOver] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    console.log(fileList);
    const fileArray = Array.from(fileList);
    setFiles((prev) => [...prev, ...fileArray]);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const fileList = e.dataTransfer.files;
    if (!fileList) return;
    setIsDragging(false);

    const fileArray = Array.from(fileList);
    setFiles((prev) => [...prev, ...fileArray]);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const exceedFilesLimit = () => {
    if (files.length > MAX_FILES_LIMIT) {
      alert(`You have exceeded the upload limit of ${MAX_FILES_LIMIT} files.`);
      return true;
    }
    return false;
  };

  const handleDelete = (fileIndex: number) => {
    setFiles((prev) => prev.filter((_, i) => i != fileIndex));
  };

  const handleSubmit = () => {
    if (exceedFilesLimit()) return;

    onUpload();
  };

  return (
    <div className={styles.container}>
      <div
        className={`
          ${styles.uploadContainer} 
          ${isDragging ? styles.isDragging : ""} 
          ${isMouseOver ? styles.isMouseOver : ""}
          ${isUploading ? styles.disabled : ""}`}
        onClick={handleClick}
        onDrop={(e) => {
          handleDrop(e);
          setIsDragging(false);
        }}
        onDragOver={handleDragOver}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onMouseEnter={() => setIsMouseOver(true)}
        onMouseLeave={() => setIsMouseOver(false)}
      >
        <Icon icon="material-symbols:upload-rounded" fontSize={32} />
        <div className={styles.title}>
          Drag and drop files or click to select
        </div>
        <div className={styles.description}>
          MP3, WAV, M4A, FLAC, OGG (Max. 1 MB)
        </div>
        <input
          aria-label="file upload"
          ref={inputRef}
          disabled={isUploading}
          hidden
          multiple
          type="file"
          accept=".mp3,.wav,.m4a,.flac,.ogg"
          onChange={handleChange}
        />
      </div>
      <div className={styles.filesContainer}>
        {files?.map((file, i) => (
          <Fade in timeout={800} key={`${file.name}-${i}`}>
            <div className={styles.card}>
              <span className={styles.filename}>{file.name}</span>
              <IconButton
                onClick={() => handleDelete(i)}
                disabled={isUploading}
                sx={{
                  color: "red",
                }}
              >
                <Icon icon="material-symbols:close-rounded" />
              </IconButton>
            </div>
          </Fade>
        ))}
      </div>
      {files?.length > 0 && (
        <Fade in timeout={800}>
          <Button
            id="submit"
            size="medium"
            variant="outlined"
            onClick={handleSubmit}
            loading={isUploading}
            loadingIndicator={<Icon icon="eos-icons:loading" fontSize={24} />}
            sx={{
              width: "auto",
              textTransform: "capitalize",
              backgroundColor: colors.accent2,
            }}
          >
            Upload
          </Button>
        </Fade>
      )}
    </div>
  );
}

export default Upload;
