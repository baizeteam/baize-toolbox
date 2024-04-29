import React, { useState, useEffect, useRef } from "react"
import { Modal, ModalProps, Radio, Select, Slider } from "antd"
import "./index.module.less"
import { useTranslation } from "react-i18next"
import { fileSelectAccetps, fpsList } from "@renderer/utils/fileHelper"
import AppLoading from "@renderer/components/AppLoading"

interface ITypeModalProps extends Omit<ModalProps, "onOk"> {
  filePath: string
  onOk: (value: string) => void
}

export default function TypeModal(props: ITypeModalProps) {
  const { filePath, onOk, open } = props
  const [loading, setLoading] = useState<boolean>(false)
  const [fileInfo, setFileInfo] = useState<any>()
  const [settingInfo, setSettingInfo] = useState<any>()

  const settingInfoRef = useRef(settingInfo)

  const { t } = useTranslation()

  useEffect(() => {
    init()
  }, [open])

  // 初始化，获取视频信息
  const init = async () => {
    if (filePath && open) {
      setLoading(true)
      const res = await window.ipcInvoke("FFMPEG_GET_VIDEO_INFO", {
        filePath
      })
      console.log(res)
      setFileInfo(res)
      changeSettingInfo({
        frameRate: res.frameRate,
        bitrate: res.bitrate
      })
      setLoading(false)
    }
  }

  // 改变设置信息
  const changeSettingInfo = (obj) => {
    const params = { ...settingInfoRef.current, ...obj }
    settingInfoRef.current = params
    setSettingInfo(params)
  }

  // 确定
  const _handleOk = () => {
    onOk(settingInfo)
  }

  const fpsOptions = fpsList.map((item) => {
    return {
      label: item + "fps",
      value: item,
      disabled: item > fileInfo?.frameRate
    }
  })

  return (
    <Modal
      title={t("siteMain.pages.compress.typeModal.title")}
      {...props}
      onOk={_handleOk}
      okButtonProps={{ disabled: loading || !settingInfo }}
    >
      <div>
        {loading ? (
          <AppLoading />
        ) : (
          <>
            {fileSelectAccetps?.video.includes(filePath?.split(".").pop()) && (
              <div styleName="video-info">
                <div styleName="info">
                  <div styleName="title">{t("siteMain.pages.compress.typeModal.infoTitle")}</div>
                  <div styleName="content">
                    <div>
                      {t("commonText.bitrate")}:{fileInfo?.bitrate}
                    </div>
                    <div>
                      {t("commonText.duration")}:{fileInfo?.duration}
                    </div>
                    <div>
                      {t("commonText.fps")}:{fileInfo?.frameRate}
                    </div>
                    <div>
                      {t("commonText.resolution")}:{fileInfo?.resolution?.width}x{fileInfo?.resolution?.height}
                    </div>
                  </div>
                </div>

                <div styleName="setting">
                  <div styleName="title">{t("siteMain.pages.compress.typeModal.compressSetting")}</div>
                  <div styleName="content">
                    <div>
                      {t("commonText.fps")}:
                      <Select
                        options={fpsOptions}
                        defaultValue={fileInfo?.frameRate}
                        onChange={(e) => {
                          changeSettingInfo({
                            frameRate: e
                          })
                        }}
                        size="small"
                      />
                    </div>
                    <div>
                      {t("commonText.bitrate")}:
                      <div style={{ padding: "0 16px" }}>
                        <Slider
                          defaultValue={fileInfo?.bitrate}
                          marks={{
                            128: "128kbps",
                            256: "256kbps",
                            512: "512kbps",
                            1024: "1Mbps",
                            2048: "2Mbps",
                            4096: "4Mbps"
                          }}
                          max={fileInfo?.bitrate}
                          min={128}
                          onChange={(e) => {
                            changeSettingInfo({
                              bitrate: e
                            })
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  )
}
