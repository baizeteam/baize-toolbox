import si from "systeminformation"
import os from "os"

export const getSystemInfo = async () => {
  return {
    patform: os.platform(),
    release: os.release(),
    graphics: await si.graphics(),
  }
}
