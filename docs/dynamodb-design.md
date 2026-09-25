# DynamoDB design

This migration uses separate tables rather than an opaque single-table design.
Every item retains its legacy numeric ID as its primary application identity.

| Table suffix | PK | Index / access pattern |
| --- | --- | --- |
| Users | `userId` | email and username lookup (GSI) |
| Articles | `postId` | public list, author list, marker list, category list via explicit GSIs or bounded scans |
| Markers | `markerId` | park query and marker coordinate lookup |
| Likes | `likeId` | unique `userId#postId`, user likes query |
| Goods | `goodId` | unique hashed `ip#postId`, article count/query |
| SpecialMaps | `specialMapId` | public and author lists |
| SpecialMapMarkers | `specialMapMarkerId` | `specialMapId` query |

At the expected small scale, bounded scans with explicit limits and opaque
pagination cursors are acceptable for free-text keyword search. The API never
returns an unbounded DynamoDB scan. Conditional writes enforce Like and Good
uniqueness. Counter fields are maintained transactionally where they are used
for public list rendering, and migration validation recalculates them.

Migration imports legacy rows in dependency order: Users and Markers, Articles,
Likes and Goods, SpecialMaps, then SpecialMapMarkers. Each write is conditional
on the retained ID; reruns are safe and report whether an identical item was
skipped or a conflicting item was found.

