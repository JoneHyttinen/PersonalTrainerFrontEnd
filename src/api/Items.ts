import type { Customer } from "../types/Customer";
import type { Training } from "../types/Training";

const API_URL =
  "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/";

export interface NewCustomerData {
  firstname: string;
  lastname: string;
  streetaddress: string;
  postcode: string;
  city: string;
  email: string;
  phone: string;
}

export interface NewTrainingData {
  date: string;
  duration: number;
  activity: string;
  customer: string;
}

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

export const getCustomerByLink = async (
  link: string,
): Promise<Customer | null> => {
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

export const addCustomer = async (
  customer: NewCustomerData,
): Promise<Customer> => {
  const response = await fetch(`${API_URL}customers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  });

  if (!response.ok) {
    throw new Error("Failed to add customer");
  }

  return response.json();
};

export const addTraining = async (
  training: NewTrainingData,
): Promise<Training> => {
  const response = await fetch(`${API_URL}trainings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(training),
  });

  if (!response.ok) {
    throw new Error("Failed to add training");
  }

  return response.json();
};

export const updateCustomer = async (
  customerLink: string,
  customer: NewCustomerData,
): Promise<Customer> => {
  const response = await fetch(customerLink, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  });

  if (!response.ok) {
    throw new Error("Failed to update customer");
  }

  return response.json();
};

export const deleteCustomer = async (customerLink: string): Promise<void> => {
  const response = await fetch(customerLink, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete customer");
  }
};

export const deleteTraining = async (trainingLink: string): Promise<void> => {
  const response = await fetch(trainingLink, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete training");
  }
};
