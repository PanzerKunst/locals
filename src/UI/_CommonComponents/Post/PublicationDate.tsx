import { Helmet } from "react-helmet"

import { getFormattedPostPublicationDate } from "../../../Util/DateUtils.ts"

import "./PublicationDate.scss"

type Props = {
  publishedAt: string;
}

export function PublicationDate({ publishedAt }: Props) {
  return (
    <div className="publication-date">
      <Helmet><meta name="date" content={publishedAt}/></Helmet>
      <span>{getFormattedPostPublicationDate(publishedAt)}</span>
    </div>
  )
}
