import { Icon } from "@iconify/react";
import {
  AccordionDetails,
  AccordionSummary,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";
import { useState } from "react";
import type { Transcription } from "../interfaces/transcription";
import colors from "../styles/colors";
import styles from "./TranscriptionAccordion.module.css";

interface Props {
  transcription: Transcription;
  expanded: boolean;
  onDelete: (id: number) => void;
}

function TranscriptionAccordion({
  transcription,
  expanded,
  onDelete,
}: Readonly<Props>) {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const URL = import.meta.env.VITE_BACKEND_SERVICE + "/";

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
        <Stack direction="row" justifyContent="space-between">
          <div>
            <div>{transcription.filename}</div>
            <div className={styles.details}>
              <div className={styles.iconText}>
                <Icon icon="lets-icons:date-today" />
                {new Date(transcription.created_at).toLocaleDateString("en-SG")}
              </div>
              <div className={styles.iconText}>
                <Icon icon="mingcute:time-line" />
                {new Date(transcription.created_at + "Z").toLocaleTimeString(
                  "en-SG",
                )}
              </div>
            </div>
          </div>
          <Stack flexDirection="row" alignItems="center" mr={2}>
            <audio
              controls
              style={{ height: 30 }}
              id={transcription.filename}
              src={URL + transcription.filepath}
            ></audio>
            <IconButton
              component="span"
              onClick={(e) => {
                e.stopPropagation();
                setOpenDialog(true);
              }}
            >
              <Icon icon="material-symbols:delete-outline" fontSize={20} />
            </IconButton>
          </Stack>
        </Stack>
      </AccordionSummary>
      {expanded && (
        <AccordionDetails>{transcription.transcript}</AccordionDetails>
      )}
      <Dialog open={openDialog}>
        <DialogTitle>Confirm delete?</DialogTitle>
        <DialogContent>{transcription.filename}</DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <ButtonGroup
            sx={{
              ".MuiButton-root": {
                color: colors.secondary,
                borderColor: colors.accent2,
              },
            }}
          >
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              sx={{ backgroundColor: colors.accent2 }}
              onClick={() => {
                onDelete(transcription.id);
                setOpenDialog(false);
              }}
            >
              Confirm
            </Button>
          </ButtonGroup>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TranscriptionAccordion;
