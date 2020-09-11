export const addRecord = (session, record) => {
  return [...session, {...record}];
};

export const updateRecord = (record, speed, location, time) => {
  const newRecord = {
    speed: speed,
    location: location,
    time: time,
  };
  //record.push(newRecord);
  return record;
};
