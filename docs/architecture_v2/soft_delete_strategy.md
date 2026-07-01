# Soft Delete Policy

1. **Mechanism**: Soft deletion is managed via the `deleted_at` TIMESTAMP column. A `NULL` value means active. A non-null timestamp indicates the record was deleted.
2. **Cascading**: A soft delete of a parent record (e.g., an Organization) should idealy trigger a soft delete of children, OR the application layer must ensure orphaned active children are inaccessible. 
3. **Hard Deletes**: Hard deletes (`DELETE FROM ...`) are strictly forbidden on production databases for compliance and auditability.
4. **Unique Constraints**: All `UNIQUE` constraints must be implemented as Partial Indexes excluding deleted rows (`WHERE deleted_at IS NULL`).
