import * as React from "react"
import "./index.module.less"
import "./iconfont.js"

interface AppIconProps {
  icon: string
  className?: string
  fontSize?: number | string
  color?: React.CSSProperties["color"]
  [key: string]: any
}

export default function AppIcon(props: AppIconProps) {
  const { icon, className, fontSize, color, ...rest } = props
  const style: React.CSSProperties = {}
  fontSize && (style.fontSize = typeof fontSize === "number" ? `${fontSize}px` : fontSize)
  color && (style.color = color)
  const isSvg = icon.indexOf("#") === 0

  return isSvg ? (
    <svg className={`app-icon ${className || ""}`} aria-hidden="true" style={style} {...rest}>
      <use xlinkHref={icon} />
    </svg>
  ) : (
    <i className={`app-icon iconfont ${icon} ${className || ""}`} style={style} {...rest} />
  )
}
