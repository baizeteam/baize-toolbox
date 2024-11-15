import React, { useState, useMemo, useEffect } from "react"
import "./index.module.less"
import { Button, Input, Table, Cascader, message, Divider } from "antd"
import type { TableProps } from "antd"
import { nanoid } from "nanoid"
import { EdgeSpeechTTS } from "@lobehub/tts"
import AudioPlay from "@renderer/components/AudioPlay"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"
import { tableText, tableCreateTime, DeleteRecordBtn, SaveFileBtn } from "@renderer/utils/tableHelper"
import AppTableHeader from "@siteMain/components/AppTableHeader"

enum EStatus {
  pending = "pending",
  success = "success",
  error = "error",
}

interface IAudioItem {
  taskId: string
  voice: string
  text: string
  url: string | null
  createTime: number
  status: EStatus
}

const base64ToBlob = (base64: string) => {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  let blob = new Blob([bytes], { type: "audio/mp3" })
  const url = URL.createObjectURL(blob)
  return url
}

export default function TTS() {
  const [value, setValue] = useState("如果你也喜欢这个项目就点个star吧")
  const [voiceSelect, setVoiceSelect] = useState<string[]>(["zh-CN", "zh-CN-XiaoxiaoNeural"])
  const [audioList, setAudioList] = useState<IAudioItem[]>([])
  const { t } = useTranslation()
  const { pathname } = useLocation()

  // 保存语音
  const saveTTS = async (record, filePath) => {
    const res = await window.ipcInvoke("WIN_DOWNLOAD_BASE64", {
      base64: record.url,
      filePath,
    })
    if (res === true) {
      message.success(t("translation:commonText.saveSuccess"))
    } else {
      message.error(t("translation:commonText.saveError"))
    }
  }

  const columns = [
    tableText,
    {
      title: t("translation:commonText.audio"),
      dataIndex: "url",
      width: 120,
      key: "url",
      render: (url: string) => {
        return url ? <AudioPlay src={base64ToBlob(url)} /> : "生成中。。。"
      },
    },
    {
      title: t("translation:commonText.vocalLine"),
      dataIndex: "voice",
      key: "voice",
      width: 160,
      render: (voice: string) => EdgeSpeechTTS.voiceName[voice],
    },
    tableCreateTime,
    {
      title: t("translation:commonText.action"),
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        return (
          <>
            <SaveFileBtn record={record} suffix=".mp3" callback={(filePath) => saveTTS(record, filePath)} />
            <DeleteRecordBtn record={record} callback={init} />
          </>
        )
      },
    },
  ]

  const options = useMemo(() => {
    return Object.keys(EdgeSpeechTTS.voiceList).map((item) => {
      return {
        value: item,
        label: item,
        children: EdgeSpeechTTS.voiceList[item].map((voice) => {
          return {
            value: voice,
            label: EdgeSpeechTTS.voiceName[voice],
          }
        }),
      }
    })
  }, [])

  const createTTS = async () => {
    if (!value) {
      message.error("请输入文本")
      return
    }
    const taskId = nanoid(16)
    const params = {
      taskId,
      text: value,
      voice: voiceSelect[1],
      url: null,
      createTime: Date.now(),
      status: EStatus.pending,
      code: "tts",
    }
    setAudioList((res) => {
      return [params, ...res]
    })
    await window.ipcInvoke("TTS_CREATE", params)
    const ttsList = await window.ipcInvoke("GET_STORE", "ttsList")
    setAudioList(ttsList)
  }

  const init = () => {
    window.ipcInvoke("GET_STORE", "ttsList").then((res) => {
      setAudioList(res)
    })
  }

  useEffect(() => {
    init()
  }, [pathname])

  return (
    <div styleName="tts" className="common-content">
      <Input.TextArea
        placeholder="请输入文本（最多200个字符）"
        value={value}
        count={{
          max: 200,
          exceedFormatter: (value, config) => {
            return value.slice(0, config.max)
          },
        }}
        onChange={(e) => setValue(e.target.value)}
        autoSize={{
          minRows: 5,
          maxRows: 5,
        }}
      />
      <div styleName="action">
        <div>
          <span styleName="label">{t("translation:commonText.vocalLine")}</span>
          <Cascader
            allowClear={false}
            options={options}
            value={voiceSelect}
            onChange={(value) => setVoiceSelect(value)}
          />
        </div>
        <Button onClick={createTTS} type="primary">
          {t("translation:commonText.generate")}
        </Button>
      </div>
      <Divider />
      <div>
        <AppTableHeader title={"siteMain.pages.TTS.tableTitle"} valueKey="ttsList" onClean={() => setAudioList([])} />
        <Table
          columns={columns}
          dataSource={audioList}
          rowKey="taskId"
          pagination={{ pageSize: 5, total: audioList.length }}
        />
      </div>
    </div>
  )
}
