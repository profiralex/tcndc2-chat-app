const generateMessage = (from, text) => {
  return { from, text, createdAt: new Date().getTime() };
};

const generateLocationMessage = (from, latitude, longitude) => {
  const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
  return { from, url, createdAt: new Date().getTime() };
};

module.exports = { generateMessage, generateLocationMessage };
