# Migration validation

Source dump: production MySQL snapshot obtained 2026-09-25 and retained outside
this repository. Validation was performed against a temporary local MySQL 8.0.31
instance, then imported to the CDK-managed staging DynamoDB tables.

| Entity | Source | Staging DynamoDB | Orphan relations |
| --- | ---: | ---: | ---: |
| User | 143 | 143 | — |
| Article | 294 | 294 | 0 author/marker |
| Marker | 230 | 230 | — |
| Like | 54 | 54 | 0 user/article |
| Good | 200 | 200 | 0 article |
| SpecialMap | 33 | 33 | 0 author |
| SpecialMapMarker | 700 | 700 | 0 SpecialMap |

The migration was resumed after an interrupted first run; existing identical
items were skipped and the final record counts matched. This verifies the
repeatable/idempotent behavior for the initial import.
