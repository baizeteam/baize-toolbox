import React, { useState, useMemo, useEffect } from "react";
import "./index.module.less";
import { Button, Input, Table, Cascader, message } from "antd";
import type { TableProps } from "antd";
import { nanoid } from "nanoid";
import { EdgeSpeechTTS } from "@lobehub/tts";
import AudioPlay from "@renderer/components/AudioPlay";
import { formatTime } from "@renderer/utils/formatTime";

enum EStatus {
  pending = "pending",
  success = "success",
  error = "error",
}

interface IAudioItem {
  id: string;
  voice: string;
  text: string;
  url: string;
  createTime: number;
  status: EStatus;
}

const base64ToBlob = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  let blob = new Blob([bytes], { type: "audio/mp3" });
  const url = URL.createObjectURL(blob);
  return url;
};

export default function TTS() {
  const [value, setValue] = useState("如果你也喜欢这个项目就点个star吧");
  const [voiceSelect, setVoiceSelect] = useState<string[]>([
    "zh-CN",
    "zh-CN-XiaoxiaoNeural",
  ]);
  const [audioList, setAudioList] = useState<IAudioItem[]>([]);

  useEffect(() => {
    window.electron.ipcRenderer.invoke("GET_STORE", "ttsList").then((res) => {
      setAudioList(res);
    });
  }, []);

  const columns = useMemo(() => {
    return [
      {
        title: "文本",
        dataIndex: "text",
        key: "text",
        width: 200,
      },
      {
        title: "音频",
        dataIndex: "url",
        width: 200,
        key: "url",
        render: (url: string) => {
          return url ? <AudioPlay src={base64ToBlob(url)} /> : "生成中。。。";
        },
      },
      {
        title: "声线",
        dataIndex: "voice",
        key: "voice",
        width: 100,
        render: (voice: string) => EdgeSpeechTTS.voiceName[voice],
      },
      {
        title: "创建时间",
        dataIndex: "createTime",
        key: "createTime",
        width: 100,
        render: (createTime: number) => formatTime(createTime),
      },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
        width: 100,
        render: (_, record) => {
          return (
            <Button
              onClick={() => {
                // todo
                console.log(record);
              }}
              type="link"
            >
              下载
            </Button>
          );
        },
      },
    ];
  }, []);

  const options = useMemo(() => {
    return Object.keys(EdgeSpeechTTS.voiceList).map((item) => {
      return {
        value: item,
        label: item,
        children: EdgeSpeechTTS.voiceList[item].map((voice) => {
          return {
            value: voice,
            label: EdgeSpeechTTS.voiceName[voice],
          };
        }),
      };
    });
  }, []);

  const createTTS = async () => {
    if (!value) {
      message.error("请输入文本");
      return;
    }
    const id = nanoid(16);
    const params = {
      id,
      text: value,
      voice: voiceSelect[1],
      url: null,
      createTime: Date.now(),
      status: EStatus.pending,
    };
    setAudioList((res) => {
      return [params, ...res];
    });
    const payload = {
      input: value,
      options: {
        voice: voiceSelect[1],
      },
    };

    await window.electron.ipcRenderer.invoke("TTS_CREATE", params);
    const ttsList = await window.electron.ipcRenderer.invoke(
      "GET_STORE",
      "ttsList"
    );
    console.log(ttsList);
    setAudioList(ttsList);
  };

  return (
    <div styleName="tts">
      <Input.TextArea
        placeholder="请输入文本（最多200个字符）"
        value={value}
        count={{
          max: 200,
          exceedFormatter: (value, config) => {
            return value.slice(0, config.max);
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
          <span styleName="label">声线</span>
          <Cascader
            allowClear={false}
            options={options}
            value={voiceSelect}
            onChange={(value) => setVoiceSelect(value)}
          />
        </div>
        <Button onClick={createTTS} type="primary">
          生成
        </Button>
      </div>

      <div>
        <Table columns={columns} dataSource={audioList} rowKey="id" />
      </div>
    </div>
  );
}
