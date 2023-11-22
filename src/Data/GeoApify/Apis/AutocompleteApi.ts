import qs from "qs"

import { config } from "../../../config.ts"
import { GeoapifyFeature } from "../Models/GeoapifyFeature.ts"

export async function fetchLocations(search: string): Promise<GeoapifyFeature[]> {
  const queryParams = {
    text: search,
    apiKey: config.GEOAPIFY_API_KEY,
  }

  const result = await fetch(`${config.GEOAPIFY_API_URL}/autocomplete?${qs.stringify(queryParams)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })

  if (!result.ok) {
    throw new Error("Error while fetching locations")
  }

  return await result.json() as GeoapifyFeature[]
}
