import classNames from "classnames"
import ReactPlayer from "react-player/lazy"

import { config } from "../../config.ts"

import "./VideoPlayer.scss"

type Props = {
  url: string;
}

export function VideoPlayer({ url }: Props) {
  const isHosted = url.startsWith(config.BACKEND_URL)

  return (
    <div className={classNames("video-player", { hosted: isHosted })}>
      {isHosted ? (
        <div>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            src={url}
            controls
            playsInline
          >
            Your browser does not support HTML5 video.
          </video>
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
