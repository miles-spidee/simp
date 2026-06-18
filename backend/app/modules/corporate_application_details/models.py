"""
corporate_application_details/models.py

The `corporate_application_details` table is COMMENTED OUT in the SQL schema
(database/schema.sql §3.4) — no table is created in the database.

Per the architectural decision to follow the SQL schema strictly, no ORM model
is defined in this module. If a corporate-specific table is added to the schema
in the future, define the model here and import it into any relevant module.
"""

# No model defined — corporate_application_details table is omitted from the
# current schema. See database/schema.sql §3.4 for context.