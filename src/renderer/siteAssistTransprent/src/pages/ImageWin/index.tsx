import React, { useEffect, useState } from "react"
import "./index.module.less"

export default function ImageWin() {
  const [img, setImg] = useState<string>()

  const init = () => {
    setImg(window.injectData.base64)
  }

  useEffect(() => {
    init()
  }, [])
  return (
    <div styleName="image-win">
      <img src={img} alt="图片" />
    </div>
  )
}
