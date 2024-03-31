import React, { useState, useMemo } from "react";
import "./index.module.less";
import { Button, Input, Table, Cascader } from "antd";
import type { TableProps } from "antd";
import { nanoid } from "nanoid";
import { EdgeSpeechTTS } from "@lobehub/tts";
import * as TTSApi from "@lobehub/tts";
import EllipsisTextControl from "@renderer/components/EllipsisTextControl";
import AudioPlay from "@renderer/components/AudioPlay";

console.log(TTSApi, EdgeSpeechTTS.voiceName);

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
        render: (text: string) => {
          return <EllipsisTextControl content={text} width={160} />;
        },
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
        title: "状态",
        dataIndex: "status",
        key: "status",
        width: 100,
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
        placeholder="请输入文本"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Cascader
        allowClear={false}
        options={options}
        value={voiceSelect}
        onChange={(value) => setVoiceSelect(value)}
      />
      <Button onClick={createTTS}>生成</Button>
      <div>
        <Table columns={columns} dataSource={audioList} rowKey="id" />
      </div>
    </div>
  );
}
