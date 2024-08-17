const fs = require('fs').promises
const path = require('path')

const fetchFiles = async directory => {
 const files = await fs.readdir(directory)
 const jsFiles = files.filter(file => path.extname(file).toLowerCase() === '.js')

 const loadedModules = []

 for (const file of jsFiles) {
  const filePath = path.join(directory, file)
  try {
   const module = require(filePath)
   loadedModules.push(module)
  } catch (error) {
   const errorMessage = `Error in file ${filePath}:\n${error.stack}`
   console.error(errorMessage)

   // Display error for 3 seconds without exiting
   await new Promise(resolve => {
    setTimeout(() => {
     console.clear()
     resolve()
    }, 3000)
   })
  }
 }

 return loadedModules
}

module.exports = fetchFiles
