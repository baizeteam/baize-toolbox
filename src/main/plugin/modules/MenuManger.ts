import { BrowserWindow, Menu, MenuItem } from "electron"

export class MenuManger {
  public menuMap: Map<string, MenuItem>
  constructor(props) {
    const { menuObj } = props
    this.menuMap = new Map<string, MenuItem>()
    Object.keys(menuObj).map((item) => {
      this.menuMap.set(item, menuObj[item])
    })
  }

  // 注册Menu
  public registerMenu(menuName: string, menuItem: MenuItem) {
    if (!this.menuMap.has(menuName)) {
      this.menuMap.set(menuName, menuItem)
    } else {
      throw Error(menuName + "已注册")
    }
    return this.menuMap.get(menuName)
  }

  // 注销Menu
  public unRegisterMenu(menuName: string) {
    if (this.menuMap.has(menuName)) {
      this.menuMap.delete(menuName)
    }
  }

  public getMenu(list: string[]) {
    const contextMenu = new Menu()
    list.map((item) => {
      if (this.menuMap.has(item)) {
        contextMenu.append(this.menuMap.get(item)!)
      } else {
        throw Error(item + "未注册")
      }
    })
    return contextMenu
  }
}

const menuObj = {
  destory: new MenuItem({
    label: "销毁",
    click: (menuItem, browserWindow, event) => {
      browserWindow?.destroy()
    },
  }),
  reload: new MenuItem({
    label: "刷新",
    click: (menuItem, browserWindow, event) => {
      if (browserWindow) {
        console.log(browserWindow.webContents.getURL())
        browserWindow.reload()
        showCustomMenu(browserWindow)
      }
    },
  }),
  devTools: new MenuItem({
    label: "开发者工具",
    click: (menuItem, browserWindow, event) => {
      browserWindow?.webContents?.openDevTools()
    },
  }),
}

const DEFAULT_MENU_LIST = ["destory", "reload", "devTools"]

export const showCustomMenu = (win: BrowserWindow, menuList: string[] = DEFAULT_MENU_LIST) => {
  if (process.env.NODE_ENV === "development") {
    win.webContents.on("context-menu", (e, params) => {
      const menu = menuManger.getMenu(menuList)
      menu.popup({ x: params.x, y: params.y })
    })
  }
}

export const menuManger = new MenuManger({ menuObj })
