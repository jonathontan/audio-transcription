import { Icon } from "@iconify/react";
import { AccordionDetails, AccordionSummary } from "@mui/material";
import type { Transcription } from "../interfaces/transcription";
import styles from "./TranscriptionAccordion.module.css";

interface Props {
  transcription: Transcription;
  expanded: boolean;
}

function TranscriptionAccordion({ transcription, expanded }: Readonly<Props>) {
  return (
    <>
      <AccordionSummary
        className={styles.accordion}
        expandIcon={<Icon icon="iconoir:nav-arrow-down" fontSize={24} />}
        sx={{
          ".MuiAccordionSummary-content": {
            flexDirection: "column",
            gap: 1,
          },
        }}
      >
        <div>{transcription.filename}</div>
        <div className={styles.details}>
          <div className={styles.iconText}>
            <Icon icon="lets-icons:date-today" />
            {new Date(transcription.created_at).toLocaleDateString("en-SG")}
          </div>
          <div className={styles.iconText}>
            <Icon icon="mingcute:time-line" />
            {new Date(transcription.created_at).toLocaleTimeString()}
          </div>
        </div>
      </AccordionSummary>
      {expanded && (
        <AccordionDetails>{transcription.transcript}</AccordionDetails>
      )}
    </>
  );
}

export default TranscriptionAccordion;
