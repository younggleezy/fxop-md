const groupDb = require("./groupDb");

async function makeInDb(jid, data, name) {
 try {
  let updatedRecord;
  const existingRecord = await groupDb.findOne({
   where: { jid, name },
  });

  if (existingRecord) {
   existingRecord.message = JSON.stringify(data);
   existingRecord.status = data.status;
   updatedRecord = await existingRecord.save();
  } else {
   updatedRecord = await groupDb.create({
    jid,
    message: JSON.stringify(data),
    name,
    status: data.status,
   });
  }

  return updatedRecord;
 } catch (error) {
  console.error("Error in makeInDb:", error);
  return false;
 }
}

module.exports = { makeInDb };
