import qs from "qs"

import { config } from "../../../config.ts"
import { GeoapifyFeature } from "../Models/GeoapifyFeature.ts"

export async function searchLocations(text: string): Promise<GeoapifyFeature[]> {
  const queryParams = {
    text,
    format: "json",
    apiKey: config.GEOAPIFY_API_KEY,
  }

  const result = await fetch(`${config.GEOAPIFY_API_URL}/autocomplete?${qs.stringify(queryParams)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })

  if (!result.ok) {
    throw new Error("Error while fetching locations")
  }
  const json = await result.json() as { results: GeoapifyFeature[] }
  return json.results
}
