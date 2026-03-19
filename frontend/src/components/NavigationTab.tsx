import { Tab, Tabs } from "@mui/material";
import { type SyntheticEvent } from "react";
import styles from "./Navigationtab.module.css";
import colors from "../styles/colors";

interface Props {
  tabIndex: number;
  onChange: (newValue: number) => void;
}

function NavigationTab({ tabIndex, onChange }: Readonly<Props>) {
  const handleChange = (_e: SyntheticEvent, newValue: number) => {
    onChange(newValue);
  };

  return (
    <Tabs
      variant="fullWidth"
      value={tabIndex}
      indicatorColor="secondary"
      textColor="secondary"
      onChange={handleChange}
      className={styles.tab}
      slotProps={{
        indicator: {
          sx: { display: "none" },
        },
      }}
      sx={{
        backgroundColor: colors.secondarybg,
        ".MuiTab-root": {
          color: colors.secondary,
          fontWeight: "bold",

          borderRadius: "25px",
          textTransform: "capitalize",
          background: colors.secondarybg,
          transition: "background-color 500ms ease-in-out"
        },
        ".Mui-selected": {
          color: colors.primary + "!important",
          backgroundColor: colors.accent,
        },
      }}
    >
      <Tab label="Upload" />
      <Tab label="Transcriptions" />
    </Tabs>
  );
}

export default NavigationTab;
