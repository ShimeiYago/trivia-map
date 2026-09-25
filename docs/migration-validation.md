# Migration validation

Source dump: production MySQL snapshot obtained 2026-09-25 and retained outside
this repository. A read-only validation was performed on 2026-09-25 against a
temporary local MySQL 8.4 restore and the deployed CDK-managed staging DynamoDB
and image bucket. No production system was changed.

| Entity | Source | Staging DynamoDB | Missing legacy IDs | Field mismatches |
| --- | ---: | ---: | ---: | ---: |
| User | 143 | 143 | 0 | 0 |
| Article | 294 | 294 | 0 | 0 |
| Marker | 230 | 230 | 0 | 0 |
| Like | 54 | 54 | 0 | 0 |
| Good | 200 | 200 | 0 | 0 |
| SpecialMap | 33 | 33 | 0 | 0 |
| SpecialMapMarker | 700 | 700 | 0 | 0 |

All relation checks were zero: article author/marker, like user/article, good
article, Special Map author, and Special Map marker/map. All 68 Twitter
identities matched their migrated users. Of 772 referenced images, 0 were
missing and 0 had a SHA-256 mismatch.

The migration was resumed after an interrupted first run; existing identical
items were skipped and the final record counts matched. This verifies the
repeatable/idempotent behavior for the initial import and the deployed data
matches the source snapshot.
