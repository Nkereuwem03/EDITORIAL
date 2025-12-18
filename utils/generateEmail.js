const generateEmail = (prefix = "user", domain = "example.com") => {
  const randomString = Math.random().toString(36).substring(2, 10);
  return `${prefix}+${randomString}@${domain}`;
};

export default generateEmail;

// export default generateEmail = (prefix = "user", domain = "example.com") => {
//   const timestamp = Date.now();
//   return `${prefix}+${timestamp}@${domain}`;
// }

// export default generateEmail = (prefix = "user", domain = "example.com") => {
//   const dateString = new Date().toISOString().replace(/[:.]/g, "").slice(0, -5);
//   return `${prefix}+${dateString}@${domain}`;
// }
