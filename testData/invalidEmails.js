const invalidEmails = [
  "plainaddress",
  "@no-local-part.com",
  "no-at.domain.com",
  "no-tld@domain",
  ";;@missing-local.org",
  "username@.com",
  "username@.com.com",
];

export default invalidEmails;