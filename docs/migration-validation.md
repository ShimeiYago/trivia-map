# Migration validation

Source dump: production MySQL snapshot obtained 2026-09-25 and retained outside
this repository. A read-only validation was performed again on 2026-09-26 against a
temporary local MySQL 8.4 restore and the deployed CDK-managed staging DynamoDB
and image bucket. No production system was changed.

| Entity | Source | Staging DynamoDB | Missing legacy IDs | Field mismatches |
| --- | ---: | ---: | ---: | ---: |
| User | 143 | 143 | 1 | 0 |
| Article | 294 | 294 | 0 | 0 |
| Marker | 230 | 230 | 0 | 0 |
| Like | 54 | 54 | 0 | 0 |
| Good | 200 | 200 | 0 | 0 |
| SpecialMap | 33 | 33 | 0 | 0 |
| SpecialMapMarker | 700 | 700 | 0 | 0 |

The User count includes staging acceptance data. One production legacy User ID
is intentionally absent after the requested staging account deletion, and one
staging-only acceptance User occupies the compensating count. The deleted
production-derived account was not silently recreated. This is the only
baseline/acceptance-data delta.

All relation checks were zero: article author/marker, like user/article, good
article, Special Map author, and Special Map marker/map. All 68 Twitter
identities matched their migrated users. The corrected image inventory includes
User `icon` and uploads-backed `socialIcon`: 788 referenced images, 0 missing,
and 0 SHA-256 mismatches. The image-only repair copied 16 missing User images
and skipped 772 already-matching objects without writing DynamoDB or production.

The migration was resumed after an interrupted first run; existing identical
items were skipped and the final record counts matched. This verifies the
repeatable/idempotent behavior for the initial import and the deployed data
matches the source snapshot.
