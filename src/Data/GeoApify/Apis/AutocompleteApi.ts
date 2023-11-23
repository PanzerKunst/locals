import qs from "qs"

import { config } from "../../../config.ts"
import { GeoapifyFeature } from "../Models/GeoapifyFeature.ts"

export async function searchLocations(search: string): Promise<GeoapifyFeature[]> {
  const queryParams = {
    text: search,
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

  const json = await result.json()
  return json.results as GeoapifyFeature[]
}
