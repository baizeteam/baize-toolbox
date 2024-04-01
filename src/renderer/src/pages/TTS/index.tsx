import React, { useState, useMemo } from "react";
import "./index.module.less";
import { Button, Input, Table, Cascader, message } from "antd";
import type { TableProps } from "antd";
import { nanoid } from "nanoid";
import { EdgeSpeechTTS } from "@lobehub/tts";
import AudioPlay from "@renderer/components/AudioPlay";
// import TTSWorker from "./tts.worker?worker";

// const ttsFunc = async (params): Promise<any> => {
//   return new Promise((resolve, reject) => {
//     const worker = new TTSWorker();
//     worker.postMessage({ event: "TTS_CREATE", data: params });
//     worker.onmessage = function (event) {
//       resolve(event);
//     };
//   });
// };

interface IAudioItem {
  id: string;
  text: string;
  url: string;
  createTime: number;
  status: "pending" | "success" | "error";
}

export default function TTS() {
  const [value, setValue] = useState("如果你也喜欢这个项目就点个star吧");
  const [voiceSelect, setVoiceSelect] = useState<string[]>([
    "zh-CN",
    "zh-CN-XiaoxiaoNeural",
  ]);
  const [audioList, setAudioList] = useState<IAudioItem[]>([]);

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
          return url ? <AudioPlay src={url} /> : "生成中。。。";
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
    setAudioList((res) => {
      return [
        ...res,
        {
          id,
          text: value,
          voice: voiceSelect[1],
          url: null,
          createTime: Date.now(),
          status: "pending",
        },
      ];
    });
    const payload = {
      input: value,
      options: {
        voice: voiceSelect[1],
      },
    };
    // const res = await window.electron.ipcRenderer.invoke("TTS_CREATE", payload);
    // const res = await ttsFunc(payload);
    const tts = new EdgeSpeechTTS({ locale: "zh-CN" });
    const res = await tts.create(payload);
    console.log(res);
    const buffer = await res.arrayBuffer();
    const blob = new Blob([buffer], { type: "audio/mp3" });
    const url = URL.createObjectURL(blob);
    setAudioList((res) => {
      return res.map((item) => {
        if (item.id === id) {
          return { ...item, url, status: "success" };
        }
        return item;
      });
    });
    console.log(url);
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
