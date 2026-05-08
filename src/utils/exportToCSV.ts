import type { Customer } from "../types/Customer";

export const exportCustomersToCSV = (customers: Customer[]) => {
  // Define the columns to export (excluding _links and action buttons)
  const headers = [
    "First Name",
    "Last Name",
    "Email",
    "Phone",
    "Street Address",
    "Postcode",
    "City",
  ];

  // Create CSV header row
  const csvContent = [
    headers.join(","),
    ...customers.map((customer) =>
      [
        `"${customer.firstname}"`,
        `"${customer.lastname}"`,
        `"${customer.email}"`,
        `"${customer.phone}"`,
        `"${customer.streetaddress}"`,
        `"${customer.postcode}"`,
        `"${customer.city}"`,
      ].join(","),
    ),
  ].join("\n");

  // Create a blob and download it
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `customers_${new Date().toISOString().split("T")[0]}.csv`,
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
