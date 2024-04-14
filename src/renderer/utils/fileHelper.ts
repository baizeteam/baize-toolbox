import i18n from "@renderer/i18n";
import { message } from "antd";
import platformUtil from "@renderer/utils/platformUtil";

// 允许选择的文件类型
export const fileSelectAccetps = {
  video: ["mp4", "avi", "mkv", "rmvb", "wmv", "mov", "flv", "3gp", "webm"],
  image: ["jpg", "jpeg", "png", "gif", "svg", "webp"],
  audio: ["mp3", "wav", "flac", "aac", "m4a", "amr"],
  document: [
    "doc",
    "docx",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
    "pdf",
    "txt",
    "md",
    "epub",
  ],
};

// fps 列表
export const fpsList = [24, 25, 30, 50, 60];

// 分隔符
export const separator = platformUtil.isWin ? "\\" : "/";

// 打开文件夹
export const openFolder = (path) => {
  window.electron.ipcRenderer
    .invoke("WIN_OPEN_FILE", {
      path,
    })
    .then((res) => {
      if (!res) {
        message.error(i18n.t("commonText.openFolderError"));
      }
    });
};

// 打开文件
export const openFile = (path) => {
  window.electron.ipcRenderer
    .invoke("WIN_OPEN_FILE", {
      path,
    })
    .then((res) => {
      if (!res) {
        message.error(i18n.t("commonText.openFileError"));
      }
    });
};
