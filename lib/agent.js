class Agent {
 constructor() {}

 async getOperatingSystem() {
  let osName = 'vps'
  switch (process.platform) {
   case 'win32':
    osName = 'Windows'
    break
   case 'darwin':
    osName = 'MacOS'
    break
   case 'linux':
    osName = 'Linux'
    break
   default:
    osName = 'Vps'
  }
  return osName
 }

 async getRuntime() {
  const uptime = process.uptime()
  const hours = Math.floor(uptime / 3600)
  const minutes = Math.floor((uptime % 3600) / 60)
  const seconds = Math.floor(uptime % 60)

  let formattedRuntime = ''
  if (hours > 0) {
   formattedRuntime += `${hours} hour${hours > 1 ? 's' : ''}`
  }
  if (minutes > 0) {
   if (formattedRuntime) {
    formattedRuntime += `, ${minutes} minute${minutes > 1 ? 's' : ''}`
   } else {
    formattedRuntime += `${minutes} minute${minutes > 1 ? 's' : ''}`
   }
  }
  if (seconds > 0) {
   if (formattedRuntime) {
    formattedRuntime += `, ${seconds} second${seconds > 1 ? 's' : ''}`
   } else {
    formattedRuntime += `${seconds} second${seconds > 1 ? 's' : ''}`
   }
  }

  return formattedRuntime
 }

 getCurrentDate() {
  const currentDate = new Date()
  const year = currentDate.getFullYear()
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  const day = String(currentDate.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
 }

 getCurrentTime() {
  const currentTime = new Date()
  let hours = currentTime.getHours()
  let ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  const minutes = String(currentTime.getMinutes()).padStart(2, '0')
  const seconds = String(currentTime.getSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds} ${ampm}`
 }
}

module.exports = Agent
