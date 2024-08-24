const config = require('../../config')
const { DataTypes } = require('sequelize')
const cron = require('node-cron')

const MuteDB = config.DATABASE.define('mute_settings', {
 groupId: {
  type: DataTypes.STRING,
  allowNull: false,
  unique: true,
 },
 muteTime: {
  type: DataTypes.STRING,
  allowNull: true,
 },
 unmuteTime: {
  type: DataTypes.STRING,
  allowNull: true,
 },
})

async function getMuteSettings(groupId) {
 return await MuteDB.findOne({ where: { groupId } })
}

async function setMuteSettings(groupId, muteTime, unmuteTime) {
 let settings = await getMuteSettings(groupId)
 if (settings) {
  settings.muteTime = muteTime
  settings.unmuteTime = unmuteTime
  await settings.save()
 } else {
  settings = await MuteDB.create({
   groupId,
   muteTime,
   unmuteTime,
  })
 }
 return settings
}

async function removeMuteSettings(groupId) {
 return await MuteDB.destroy({ where: { groupId } })
}

function convertTo24Hour(time12h) {
 const [time, modifier] = time12h.split(' ')
 let [hours, minutes] = time.split(':')
 if (hours === '12') {
  hours = '00'
 }
 if (modifier === 'PM') {
  hours = parseInt(hours, 10) + 12
 }
 return `${hours.padStart(2, '0')}:${minutes}`
}

function setupCronJobs(bot) {
 console.log('Setting up cron jobs...')

 const job = cron.schedule('* * * * *', async () => {
  console.log('Cron job running...')
  const now = new Date()
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  console.log(`Current time: ${currentTime}`)

  try {
   const allSettings = await MuteDB.findAll()
   console.log(`Found ${allSettings.length} mute settings`)

   for (const setting of allSettings) {
    console.log(`Checking group ${setting.groupId}: Mute time: ${setting.muteTime}, Unmute time: ${setting.unmuteTime}`)

    if (setting.muteTime === currentTime) {
     try {
      await bot.groupSettingUpdate(setting.groupId, 'announcement')
      console.log(`Group ${setting.groupId} muted at ${currentTime}`)
     } catch (error) {
      console.error(`Error muting group ${setting.groupId}:`, error)
     }
    } else if (setting.unmuteTime === currentTime) {
     try {
      await bot.groupSettingUpdate(setting.groupId, 'not_announcement')
      console.log(`Group ${setting.groupId} unmuted at ${currentTime}`)
     } catch (error) {
      console.error(`Error unmuting group ${setting.groupId}:`, error)
     }
    }
   }
  } catch (error) {
   console.error('Error in cron job:', error)
  }
 })

 console.log('Cron job set up successfully')
 return job
}

module.exports = {
 MuteDB,
 getMuteSettings,
 setMuteSettings,
 removeMuteSettings,
 convertTo24Hour,
 setupCronJobs,
}
