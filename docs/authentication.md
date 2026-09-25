# Authentication design

The legacy system uses Django users, Django password hashes, JWT refresh and
X/Twitter OAuth 1.0a. Password migration is a hard compatibility boundary: the
new API will verify legacy Django PBKDF2 hashes and rehash a successful login
with Node's current password format. No password data is placed in browser
storage or migration logs.

Staging uses secure, HttpOnly, SameSite=Lax cookies for a short-lived access
token and a rotated refresh session. CSRF protection applies to cookie-backed
state-changing routes. Access/refresh session records are stored in DynamoDB
with TTL. Login, logout, refresh, registration, email verification and reset
tokens are explicit API routes with hashed one-time token records.

X/Twitter credentials, email delivery credentials, signing keys and frontend
analytics/ad configuration are deployment-time secrets or GitHub environment
variables. They are referenced by name in CDK and never committed. Existing
social accounts keep their provider subject/account identity during migration.

