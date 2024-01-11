import ReactPlayer from "react-player/lazy"

import "./VideoPlayer.scss"

type Props = {
  url: string;
}

export function VideoPlayer({ url }: Props) {
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
