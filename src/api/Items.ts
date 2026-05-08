import type { Customer } from "../types/Customer";
import type { Training } from "../types/Training";

const API_URL =
  "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/";

interface CustomersResponse {
  _embedded?: {
    customers?: Customer[];
  };
}

export const getCustomers = async (): Promise<Customer[]> => {
  const response = await fetch(`${API_URL}customers`);
  if (!response.ok) {
    throw new Error("Failed to fetch customers");
  }
  const data: CustomersResponse = await response.json();
  return data._embedded?.customers ?? [];
};

export const getTrainings = async (): Promise<Training[]> => {
  const response = await fetch(`${API_URL}trainings`);
  if (!response.ok) {
    throw new Error("Failed to fetch trainings");
  }
  const data: { _embedded?: { trainings?: Training[] } } =
    await response.json();
  return data._embedded?.trainings ?? [];
};

export const getCustomerByLink = async (link: string): Promise<Customer | null> => {
  try {
    const response = await fetch(link);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching customer:", error);
    return null;
  }
};
