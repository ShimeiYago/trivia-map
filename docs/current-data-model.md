# Current data model

Source: Django models in the checked-out legacy API repository. Existing numeric primary keys are migration identities and must be retained.

| Entity | Legacy ID | Important fields / relations |
| --- | --- | --- |
| User | Django `id` exposed as `userId` | username, email, Django password hash, nickname, icon, socialIcon, url, active/staff flags and timestamps |
| Marker | `markerId` | latitude, longitude, park (`L`/`S`); one-to-many Articles |
| Article | `postId` | author, marker, title, description, category 0–6, image, `isDraft`, createdAt, updatedAt |
| Like | `likeId` | user + article; unique pair |
| Good | `goodId` | IP address + article; unique pair |
| SpecialMap | `specialMapId` | author, title, thumbnail, public flag, description, selectable park and map bounding box |
| SpecialMapMarker | `specialMapMarkerId` | SpecialMap, location, park, image, description and marker variant |

Image values are legacy storage paths/URLs and must be preserved verbatim during export, copied to the new image bucket only when a verified mapping is available.

