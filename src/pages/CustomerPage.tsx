import { useEffect, useState } from "react";
import type { Customer } from "../types/Customer";
import { getCustomers } from "../api/Items";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  TableSortLabel,
} from "@mui/material";
import { Box, Typography, InputAdornment, FormControl, OutlinedInput } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

type SortColumn =
  | "firstname"
  | "lastname"
  | "email"
  | "phone"
  | "streetaddress"
  | "postcode"
  | "city";
type SortDirection = "asc" | "desc";

export default function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<SortColumn>("firstname");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getCustomers()
      .then((data) => setCustomers(data))
      .catch((error) => {
        console.error("Error fetching customers:", error);
        setError("Error fetching customers");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortedCustomers = () => {
    const filtered = customers.filter((customer) => {
      const query = searchQuery.toLowerCase();
      return (
        customer.firstname.toLowerCase().includes(query) ||
        customer.lastname.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query) ||
        customer.streetaddress.toLowerCase().includes(query) ||
        customer.postcode.toLowerCase().includes(query) ||
        customer.city.toLowerCase().includes(query)
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      let aVal: string | number = "";
      let bVal: string | number = "";

      if (sortColumn === "firstname") {
        aVal = (a.firstname || "").toLowerCase();
        bVal = (b.firstname || "").toLowerCase();
      } else if (sortColumn === "lastname") {
        aVal = (a.lastname || "").toLowerCase();
        bVal = (b.lastname || "").toLowerCase();
      } else if (sortColumn === "email") {
        aVal = (a.email || "").toLowerCase();
        bVal = (b.email || "").toLowerCase();
      } else if (sortColumn === "phone") {
        aVal = (a.phone || "").toLowerCase();
        bVal = (b.phone || "").toLowerCase();
      } else if (sortColumn === "streetaddress") {
        aVal = (a.streetaddress || "").toLowerCase();
        bVal = (b.streetaddress || "").toLowerCase();
      } else if (sortColumn === "postcode") {
        aVal = (a.postcode || "").toLowerCase();
        bVal = (b.postcode || "").toLowerCase();
      } else if (sortColumn === "city") {
        aVal = (a.city || "").toLowerCase();
        bVal = (b.city || "").toLowerCase();
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  if (loading) {
    return <p>Loading customers...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" component="h2">
          Customers
        </Typography>

        <FormControl sx={{ width: 360, backgroundColor: "white", borderRadius: 1 }} variant="outlined">
          <OutlinedInput
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
            endAdornment={
              searchQuery ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery("")} aria-label="Clear search">
                    <ClearIcon fontSize="small" />
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
            minWidth: 1200,
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell align="center">Actions</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === "firstname"}
                  direction={sortColumn === "firstname" ? sortDirection : "asc"}
                  onClick={() => handleSort("firstname")}
                >
                  First Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === "lastname"}
                  direction={sortColumn === "lastname" ? sortDirection : "asc"}
                  onClick={() => handleSort("lastname")}
                >
                  Last Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === "email"}
                  direction={sortColumn === "email" ? sortDirection : "asc"}
                  onClick={() => handleSort("email")}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === "phone"}
                  direction={sortColumn === "phone" ? sortDirection : "asc"}
                  onClick={() => handleSort("phone")}
                >
                  Phone
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === "streetaddress"}
                  direction={
                    sortColumn === "streetaddress" ? sortDirection : "asc"
                  }
                  onClick={() => handleSort("streetaddress")}
                >
                  Address
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === "postcode"}
                  direction={sortColumn === "postcode" ? sortDirection : "asc"}
                  onClick={() => handleSort("postcode")}
                >
                  Postcode
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === "city"}
                  direction={sortColumn === "city" ? sortDirection : "asc"}
                  onClick={() => handleSort("city")}
                >
                  City
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getSortedCustomers().map((customer) => (
              <TableRow key={customer._links.self.href}>
                <TableCell align="center">
                  <IconButton
                    color="error"
                    aria-label={`Delete ${customer.firstname} ${customer.lastname}`}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    aria-label={`Edit ${customer.firstname} ${customer.lastname}`}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
                <TableCell>{customer.firstname}</TableCell>
                <TableCell>{customer.lastname}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.streetaddress}</TableCell>
                <TableCell>{customer.postcode}</TableCell>
                <TableCell>{customer.city}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
