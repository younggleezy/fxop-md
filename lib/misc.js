const groupDb = require("./database/groupDb");

async function createDB(jid, message, status, name) {
 try {
  let updatedRecords = [];
  const existingRecords = await groupDb.findAll({
   where: { jid, name },
  });

  if (existingRecords && existingRecords.length > 0) {
   for (const record of existingRecords) {
    record.message = message;
    record.status = status;
    await record.save();
    updatedRecords.push(record);
   }
  } else {
   const newRecord = await groupDb.create({ jid, message, name, status });
   updatedRecords.push(newRecord);
  }

  return updatedRecords;
 } catch (error) {
  console.error("Error", error);
  return false;
 }
}

async function fetchDB(jid) {
 try {
  const records = await groupDb.findAll({
   where: { jid },
  });

  if (!records) return null;

  const data = {};
  records.forEach(record => {
   data[record.name] = {
    message: record.message,
    jid: record.jid,
    status: record.status,
   };
  });

  return data;
 } catch (error) {
  console.error("Error", error);
  return false;
 }
}

async function parseDB(jid, type) {
 try {
  const data = await fetchDB(jid);

  if (type === "antidelete" && data.antidelete) {
   const antideleteData = JSON.parse(data.antidelete.message);
   return {
    action: antideleteData.action,
    value: antideleteData.value,
    status: data.antidelete.status,
    jid: data.antidelete.jid,
   };
  } else if (type === "antiword" && data.antiword) {
   const antiwordData = JSON.parse(data.antiword.message);
   return {
    action: antiwordData.action,
    value: antiwordData.value,
    status: data.antiword.status,
    jid: data.antiword.jid,
   };
  }

  return false;
 } catch (error) {
  console.error("Error", error);
  return false;
 }
}

module.exports = {
 fetchDB,
 createDB,
 parseDB,
};
