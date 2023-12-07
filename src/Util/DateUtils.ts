import dayjs from "dayjs"

export function getFormattedPostPublicationDate(isoDate: string) {
  return dayjs(isoDate).format("D MMM YYYY")
}
