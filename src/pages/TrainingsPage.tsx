import { useEffect, useState } from "react";
import type { Training } from "../types/Training";
import { deleteTraining, getTrainings, getCustomerByLink } from "../api/Items";
import dayjs from "dayjs";
import {
  Table,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TableContainer,
  TableSortLabel,
} from "@mui/material";
import {
  Box,
  Typography,
  InputAdornment,
  FormControl,
  OutlinedInput,
} from "@mui/material";
import { Delete, Search, Clear } from "@mui/icons-material";

type SortColumn = "activity" | "date" | "duration" | "customerName";
type SortDirection = "asc" | "desc";

interface TrainingWithCustomer extends Training {
  customerName?: string;
}

export default function TrainingsPage() {
  const [trainings, setTrainings] = useState<TrainingWithCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<SortColumn>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [searchQuery, setSearchQuery] = useState("");

  const loadTrainings = () => {
    setLoading(true);
    getTrainings()
      .then(async (data) => {
        const trainingsWithCustomers = await Promise.all(
          data.map(async (training) => {
            const customer = await getCustomerByLink(
              training._links.customer.href,
            );
            return {
              ...training,
              customerName: customer
                ? `${customer.firstname} ${customer.lastname}`
                : "Unknown",
            };
          }),
        );
        setTrainings(trainingsWithCustomers);
      })
      .catch((error) => {
        console.error("Error fetching trainings:", error);
        setError("Error fetching trainings");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let active = true;

    getTrainings()
      .then(async (data) => {
        const trainingsWithCustomers = await Promise.all(
          data.map(async (training) => {
            const customer = await getCustomerByLink(
              training._links.customer.href,
            );
            return {
              ...training,
              customerName: customer
                ? `${customer.firstname} ${customer.lastname}`
                : "Unknown",
            };
          }),
        );
        if (!active) {
          return;
        }
        setTrainings(trainingsWithCustomers);
        setError(null);
      })
      .catch((error) => {
        if (!active) {
          return;
        }
        console.error("Error fetching trainings:", error);
        setError("Error fetching trainings");
      })
      .finally(() => {
        if (!active) {
          return;
        }
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleDeleteTraining = async (training: TrainingWithCustomer) => {
    const shouldDelete = window.confirm(
      `Delete training ${training.activity} on ${dayjs(training.date).format("DD.MM.YYYY HH:mm")}?`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteTraining(training._links.self.href);
      loadTrainings();
    } catch (error) {
      console.error("Error deleting training:", error);
      setError("Error deleting training");
    }
  };

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortedTrainings = () => {
    const filtered = trainings.filter((training) => {
      const query = searchQuery.toLowerCase();
      return (
        (training.activity || "").toLowerCase().includes(query) ||
        (training.date || "").toLowerCase().includes(query) ||
        training.duration.toString().includes(query) ||
        (training.customerName?.toLowerCase().includes(query) ?? false)
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      let aVal: string | number = "";
      let bVal: string | number = "";

      if (sortColumn === "activity") {
        aVal = (a.activity || "").toLowerCase();
        bVal = (b.activity || "").toLowerCase();
      } else if (sortColumn === "date") {
        aVal = dayjs(a.date).valueOf() || 0;
        bVal = dayjs(b.date).valueOf() || 0;
      } else if (sortColumn === "duration") {
        aVal = a.duration || 0;
        bVal = b.duration || 0;
      } else if (sortColumn === "customerName") {
        aVal = (a.customerName || "").toLowerCase();
        bVal = (b.customerName || "").toLowerCase();
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  if (loading) {
    return <p>Loading trainings...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h5" component="h2">
          Trainings
        </Typography>

        <FormControl
          sx={{ width: 360, backgroundColor: "white", borderRadius: 1 }}
          variant="outlined"
        >
          <OutlinedInput
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            }
            endAdornment={
              searchQuery ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    <Clear fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : undefined
            }
            placeholder="Search"
            aria-label="search"
          />
        </FormControl>
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          width: "100%",
          height: "100%",
          overflowX: "auto",
        }}
      >
        <Table
          size="medium"
          sx={{
            minWidth: 900,
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell align="center">Actions</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === "activity"}
                  direction={sortColumn === "activity" ? sortDirection : "asc"}
                  onClick={() => handleSort("activity")}
                >
                  Activity
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === "date"}
                  direction={sortColumn === "date" ? sortDirection : "asc"}
                  onClick={() => handleSort("date")}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === "duration"}
                  direction={sortColumn === "duration" ? sortDirection : "asc"}
                  onClick={() => handleSort("duration")}
                >
                  Duration (min)
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === "customerName"}
                  direction={
                    sortColumn === "customerName" ? sortDirection : "asc"
                  }
                  onClick={() => handleSort("customerName")}
                >
                  Customer
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getSortedTrainings().map((training) => (
              <TableRow key={training._links.self.href}>
                <TableCell align="center">
                  <IconButton
                    color="error"
                    aria-label={`Delete training ${training.activity} on ${training.date}`}
                    onClick={() => handleDeleteTraining(training)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
                <TableCell>{training.activity}</TableCell>
                <TableCell>
                  {training.date
                    ? dayjs(training.date).format("DD.MM.YYYY HH:mm")
                    : ""}
                </TableCell>
                <TableCell>{training.duration}</TableCell>
                <TableCell>{training.customerName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
