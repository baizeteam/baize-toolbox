import fs from "fs"
import { shell } from "electron"

// 检测文件夹，如果不存在，创建文件夹
export const checkFolderExists = async (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    await fs.mkdirSync(folderPath, { recursive: true })
  }
}

// 打开文件、文件夹
export const openFile = (filePath: string) => {
  console.log("filePath", filePath)
  // 检查文件夹是否存在
  return new Promise((resolve) => {
    fs.access(filePath, fs.constants.F_OK, async (err) => {
      if (err) {
        resolve(false)
      } else {
        shell.openPath(filePath)
        resolve(true)
      }
    })
  })
}

// 打开文件夹
export const openFolder = async (folderPath: string) => {
  await checkFolderExists(folderPath)
  shell.openPath(folderPath)
  return true
}

// 删除文件
export const deleteFile = (filePath: string) => {
  return new Promise((resolve) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

// 获取文件大小
export function getFileSize(filePath: string) {
  const stats = fs.statSync(filePath)
  return stats.size
}

// 创建并写入文件
export function writeFile(filePath: string, content: string) {
  console.log(content, Object.prototype.toString.call(content))
  return fs.writeFileSync(filePath, content)
}
