import i18n from "@renderer/i18n";
import { message } from "antd";
import platformUtil from "@renderer/utils/platformUtil";

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
