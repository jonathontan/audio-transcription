import { Accordion, Pagination, Stack } from "@mui/material";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import { useMemo, useState, type SyntheticEvent } from "react";
import type { Transcription } from "../interfaces/transcription";
import TranscriptionAccordion from "./TranscriptionAccordion";
import colors from "../styles/colors";

interface Props {
  transcriptions: Transcription[];
}

function TranscriptionTable({ transcriptions }: Readonly<Props>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [expanded, setExpanded] = useState<string | false>("panel0");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 4,
  });
  const columnHelper = createColumnHelper<Transcription>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("filename", {}),
      columnHelper.accessor("created_at", {}),
    ],
    [transcriptions],
  );

  const table = useReactTable({
    data: transcriptions,
    columns,
    state: {
      sorting,
      rowSelection,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    initialState: {
      sorting: [{ id: "created_at", desc: true }],
    },
    onRowSelectionChange: setRowSelection,
  });

  const pageCount = table.getPageCount();
  const rows = table.getRowModel().rows;

  const handleAccordionChange =
    (panel: string) => (_event: SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <Stack height={"100%"}>
      {rows.length === 0 ? (
        <>No transcription found</>
      ) : (
        <>
          <div style={{ flex: 1, overflow: "auto" }}>
            {rows.map((row, index) => (
              <Accordion
                key={row.original.id}
                expanded={expanded === "panel" + index}
                onChange={handleAccordionChange("panel" + index)}
                sx={{
                  mb: 1,
                  backgroundColor: colors.secondarybg,
                  gap: 1,
                  borderRadius: "15px",
                  ":first-of-type": { borderRadius: "15px" },
                  ":last-of-type": { borderRadius: "15px" },
                  "&.MuiAccordion-root::before": {
                    display: "none"
                  }
                }}
              >
                <TranscriptionAccordion
                  key={row.original.id}
                  transcription={row.original}
                  expanded={expanded === "panel" + index}
                />
              </Accordion>
            ))}
          </div>
          <Pagination
            page={pagination.pageIndex + 1}
            count={pageCount}
            onChange={(_, page) => table.setPageIndex(page - 1)}
            shape="rounded"
            sx={{ mt: 1 }}
            color="primary"
          ></Pagination>
        </>
      )}
    </Stack>
  );
}

export default TranscriptionTable;
