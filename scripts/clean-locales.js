const fs = require("fs")
const path = require("path")

module.exports = async function (context) {
  console.log("afterPack")
  const appOutDir = context.appOutDir
  const localesDir = path.join(appOutDir, "locales")

  const localesToKeep = [
    "en-US.pak",
    "zh-CN.pak",
    // 其他需要保留的语言包
  ]

  fs.readdir(localesDir, (err, files) => {
    if (err) throw err

    files.forEach((file) => {
      if (!localesToKeep.includes(file)) {
        fs.unlink(path.join(localesDir, file), (err) => {
          if (err) throw err
          // console.log(`Deleted locale: ${file}`)
        })
      }
    })
  })
}
