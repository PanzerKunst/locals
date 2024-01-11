import ReactPlayer from "react-player/lazy"

import { config } from "../../config.ts"

import "./VideoPlayer.scss"

type Props = {
  url: string;
}

export function VideoPlayer({ url }: Props) {
  return (
    <div className="video-player">
      {url.startsWith(config.BACKEND_URL) ? (
        <div style={{ width: "100%", height: "100%"}}>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            src={url}
            controls
            playsInline
            style={{ width: "100%", height: "100%"}}
          />
        </div>
      ) : (
        <ReactPlayer
          url={url}
          controls
          width="100%"
          height="100%"
        />
      )}
    </div>
  )
}
