import ReactPlayer from "react-player/lazy"

import { config } from "../../config.ts"

import "./VideoPlayer.scss"

type Props = {
  url: string;
}

export function VideoPlayer({ url }: Props) {
  if (url.startsWith(config.BACKEND_URL)) {
    // eslint-disable-next-line jsx-a11y/media-has-caption
    return <video src={url} controls playsInline />
  }

  return (
    <div className="video-player">
      <ReactPlayer
        url={url}
        controls
        width="100%"
        height="100%"
      />
    </div>
  )
}
