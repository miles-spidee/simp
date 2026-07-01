# Normalization Report

The database architecture follows Third Normal Form (3NF) principles based on the derived frontend models.

## Key Normalization Strategies Applied:
1. **Primary Keys:** Every entity uses a surrogate UUID primary key.
2. **Foreign Keys:** Relationships are explicitly maintained via `*_id` columns (e.g. `student_id`, `batch_id`), preventing data duplication.
3. **Lookup Tables:** Enumerations from TypeScript (e.g. Statuses, Types) should be implemented as ENUM types in PostgreSQL or as separate Reference Tables depending on mutability requirements.
4. **Separation of Concerns:** Distinct entities like `UserProfile` and `Employee` are kept separate, linked by `user_id`.
