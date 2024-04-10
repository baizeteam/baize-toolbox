// 注入数据
export function InjectData({ webContents, data }) {
  webContents.on("did-finish-load", () => {
    webContents.executeJavaScript(`
      if(!window.injectData) window.injectData = {};
      window.injectData = ${JSON.stringify(data)};
    `);
  });
}
