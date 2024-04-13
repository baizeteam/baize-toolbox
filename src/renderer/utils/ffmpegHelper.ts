import { separator } from "@renderer/utils/fileHelper";
import { nanoid } from "nanoid";

// ffmpeg 命令对象转数组
export const ffmpegObj2List = (ffmpegObj) => {
  const list = [];
  for (const key in ffmpegObj) {
    list.push(key);
    if (ffmpegObj[key]) {
      list.push(ffmpegObj[key]);
    }
  }
  return list;
};

// 获取任务基本信息
export const getTaskBaseInfo = async (
  filePath: string,
  outputType: string,
  subFloder?: string,
) => {
  const oldFileName = filePath.split(separator).pop().split(".").shift();
  const outputFileName = `${oldFileName}-${new Date().getTime()}.${outputType}`;
  const outputFloaderPath = await window.electron.ipcRenderer.invoke(
    "GET_STORE",
    "defaultOutPath",
  );
  const taskId = nanoid(16);
  return {
    taskId,
    inputFilePath: filePath,
    outputFloaderPath: subFloder
      ? `${outputFloaderPath}${separator}${subFloder}`
      : outputFloaderPath,
    outputFileName,
    outputType,
    createTime: new Date().getTime(),
    progress: 0,
  };
};
