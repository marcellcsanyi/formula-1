import { Driver } from "../models/Driver";

const baseUrl = 'http://localhost:9000'

export const fetchDrivers = async (): Promise<Driver[]> => {
  console.log('Drivers fetched')
  const response = await fetch(`${baseUrl}/drivers`);
  return response.json() as Promise<Driver[]>
};

export const overtakeDriver = async (driver: Driver) =>  {
  console.log(`${driver.firstname} ${driver.lastname} overtook`)
  await fetch(`${baseUrl}/drivers/${driver.id}/overtake`, { method: "POST" });
}