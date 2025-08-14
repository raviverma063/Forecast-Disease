/**
 * @fileOverview A service for fetching location data based on an IP address.
 */

'use server';
import { z } from 'zod';

const IpLocationSchema = z.object({
  ip: z.string(),
  country: z.string(),
  country_code: z.string(),
  city: z.string().nullable(),
  region: z.string().nullable(),
  region_code: z.string().nullable(),
  postal_code: z.string().nullable(),
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string(),
  isp: z.string(),
  org: z.string(),
  asn: z.string(),
  asn_name: z.string(),
});

export type IpLocation = z.infer<typeof IpLocationSchema>;

/**
 * Fetches location data for a given IP address from the addr.zone API.
 * @param ip - The IP address to look up.
 * @returns A promise that resolves to the location data.
 */
export async function getLocationByIp(ip: string): Promise<IpLocation> {
  try {
    const response = await fetch(`https://addr.zone/api/${ip}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch location data: ${response.statusText}`);
    }
    const data = await response.json();
    return IpLocationSchema.parse(data);
  } catch (error) {
    console.error('Error fetching location from IP:', error);
    throw new Error('Could not retrieve location data from IP address.');
  }
}
