import dayjs from "dayjs"

export function getFormattedPostPublicationDate(isoDate: string) {
  const publishedAt = dayjs(isoDate)
  const currentYear = dayjs().year()

  const format = publishedAt.year() === currentYear ? "MMM D" : "D MMM YYYY"

  return dayjs(isoDate).format(format)
}
