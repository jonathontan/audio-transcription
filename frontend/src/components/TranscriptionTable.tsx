import { Accordion, IconButton, Pagination, Stack } from "@mui/material";
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
import {
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
  type SyntheticEvent,
} from "react";
import type { Transcription } from "../interfaces/transcription";
import searchTranscriptions from "../services/searchService";
import colors from "../styles/colors";
import SearchInput from "./SearchInput";
import TranscriptionAccordion from "./TranscriptionAccordion";
import { Icon } from "@iconify/react";

interface Props {
  transcriptions: Transcription[];
  initialTranscriptions: Transcription[];
  setTranscriptions: Dispatch<SetStateAction<Transcription[]>>;
}

function TranscriptionTable({
  transcriptions,
  initialTranscriptions,
  setTranscriptions,
}: Readonly<Props>) {
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
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

  const handleSearch = async () => {
    setIsSearch(true);

    try {
      const response = await searchTranscriptions(searchText);
      setTranscriptions(response);
    } catch (e: unknown) {
      if (e instanceof Error) throw new Error(e.message);
    }
  };

  const handleClearSearchResults = () => {
    setTranscriptions(initialTranscriptions);
    setIsSearch(false);
  }

  return (
    <Stack height={"100%"} gap={1}>
      <SearchInput searchText={searchText} setSearchText={setSearchText} onSearch={handleSearch} />
      {isSearch && (
        <div>
          <span>{transcriptions.length} search results for "{searchText}"</span>
          <IconButton onClick={handleClearSearchResults}>
            <Icon icon="ic:baseline-clear" fontSize={14} />
          </IconButton>
        </div>
        
      )}
      {rows.length === 0 ? (
        <>No transcription found.</>
      ) : (
        <>
          <div style={{ flex: 1, overflow: "auto", padding: 1 }}>
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
                    display: "none",
                  },
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
            sx={{ mt: 1, ml: "auto", mr: "auto" }}
            color="secondary"
            variant="outlined"
          ></Pagination>
        </>
      )}
    </Stack>
  );
}

export default TranscriptionTable;
