import React, { useRef, useState, useEffect, useCallback } from "react";
import "./index.module.less";
import { EdgeSpeechTTS } from "@lobehub/tts";
import { Button, Input, Table } from "antd";
import type { TableProps } from "antd";

interface IAudioItem {
  text: string;
  url: string;
  createTime: number;
  status: "pending" | "success" | "error";
}

export default function TTS() {
  const [value, setValue] = useState("");
  const [audioList, setAudioList] = useState<IAudioItem[]>([]);
  const ttsRef = useRef<EdgeSpeechTTS>(null);

  const columns = useCallback(() => {
    return [
      {
        title: "文本",
        dataIndex: "text",
        key: "text",
      },
      {
        title: "创建时间",
        dataIndex: "createTime",
        key: "createTime",
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
      },
    ];
  }, []);

  useEffect(() => {
    if (ttsRef.current) {
      ttsRef.current = new EdgeSpeechTTS({ locale: "en-US" });
    }
  }, []);

  const createTTS = async () => {
    const tts = ttsRef.current;
    const payload = {
      input: value,
      options: {
        voice: "en-US-GuyNeural",
      },
    };
    const res = await tts.create(payload);
    const buffer = await res.arrayBuffer();
    const blob = new Blob([buffer], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    console.log(url);
  };

  return (
    <div styleName="tts">
      <Input.TextArea
        placeholder="请输入文本"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button onClick={createTTS}>生成</Button>
      <div>
        <Table />
      </div>
    </div>
  );
}
