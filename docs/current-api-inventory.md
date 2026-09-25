# Current API inventory

Source: the checked-out `ShimeiYago/trivia-map-api` Django repository, inspected 2026-09-25. All paths are relative to the current API base URL (`https://api.triviamap.jp` in production). Trailing slash behavior must be preserved at the frontend boundary during migration.

## Public content

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/articles/detail/:postId` | Article detail with author, marker and Good count |
| GET | `/articles/public/previews` | Public article list/search/category pagination |
| GET | `/markers/:park` | Public Land (`L`) or Sea (`S`) marker list and category counters |
| GET | `/articles/categories` | Article categories |
| GET | `/guess-area` | Area names for a map coordinate |
| GET | `/articles/sitemap` | Public article sitemap source |
| GET | `/users/:userId` | Public user profile |
| GET | `/special-map/maps/public-previews` | Public Special Map list |
| GET | `/special-map/maps/:mapId/detail` | Public Special Map detail |
| GET | `/special-map/maps/:mapId/markers` | Special Map marker list |
| GET | `/special-map/maps/sitemap` | Public Special Map sitemap source |
| POST | `/goods/toggle/:postId` | Anonymous IP-keyed Good toggle |
| GET | `/goods/check/:postId` | Anonymous Good status |
| POST | `/inquiry/` | Inquiry submission |

## Authenticated content

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/articles/mine` | Current user's article list |
| POST | `/articles` | Create article and marker relationship |
| PATCH / DELETE | `/articles/:postId` | Update or delete owned article |
| GET | `/likes/mine` | Current user's liked article previews |
| POST | `/likes/toggle/:postId` | Like toggle |
| GET | `/likes/check/:postId` | Like state |
| GET | `/special-map/maps/my-previews` | Current user's maps |
| POST | `/special-map/maps` | Create map |
| PATCH / DELETE | `/special-map/maps/:mapId` | Update or delete owned map |
| POST | `/special-map/maps/:mapId/post-marker` | Create map marker |
| GET / PATCH / DELETE | `/special-map/markers/:markerId` | Read, update or delete map marker |

## Authentication

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/auths/registration/` | Email/password registration, including nickname |
| POST | `/auths/registration/verify-email/` | Confirm email verification key |
| POST | `/auths/registration/resend-email/` | Resend verification email |
| POST | `/auths/login/` | Login |
| POST | `/auths/logout/` | Logout |
| GET | `/auths/user/` | Current user details |
| PATCH | `/auths/user/update/` | Profile update including icon |
| POST | `/auths/password/change/` | Password change |
| POST | `/auths/password/reset/` | Password-reset request |
| POST | `/auths/password/reset/confirm/` | Password-reset confirmation |
| POST | `/auths/token/refresh/` | JWT refresh |
| POST | `/auths/token/verify/` | JWT verification |
| POST | `/auths/deactivate/` | Account deactivation |
| POST | `/auths/twitter/request-token` | Start X/Twitter OAuth 1.0a flow |
| POST | `/auths/twitter/access-token` | Exchange verifier for access token |
| POST | `/auths/twitter/login` | Login/link X/Twitter account |

The API has no active Google provider route. The migration therefore supports the currently implemented X/Twitter flow; a Google flow is not inferred from the plan alone.

