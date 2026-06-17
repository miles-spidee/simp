-- =============================================================================
-- INTERNSHIP APPLICATION SYSTEM — PostgreSQL Schema
-- =============================================================================
-- Source: Application Fields.pdf, Application Schema.pdf,
--         Application-schema-updated.pdf
-- Database: PostgreSQL 14+
-- Generated: 2026-06-17
-- =============================================================================

-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- SECTION 1: ENUM TYPES
-- =============================================================================

-- User roles in the system
CREATE TYPE user_role_enum AS ENUM (
    'applicant',
    'reviewer',
    'admin'
);

-- Payment modes accepted for paid internships
CREATE TYPE payment_mode_enum AS ENUM (
    'upi',
    'net_banking',
    'credit_card',
    'debit_card'
);

-- Payment verification status
CREATE TYPE payment_status_enum AS ENUM (
    'pending',
    'verified',
    'failed'
);

-- Lifecycle status of an application
CREATE TYPE application_status_enum AS ENUM (
    'draft',
    'submitted',
    'under_review',
    'shortlisted',
    'accepted',
    'rejected',
    'withdrawn'
);

-- Lifecycle status of an internship opening
CREATE TYPE opening_status_enum AS ENUM (
    'active',
    'inactive'
);

-- =============================================================================
-- SECTION 2: TABLES (in dependency order)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 2.1  users
--      Central identity table for all actors: applicants, reviewers, admins.
--      applicant_user_id and reviewed_by in applications reference this table.
-- -----------------------------------------------------------------------------
CREATE TABLE users (
    user_id         UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255)    NOT NULL UNIQUE,
    full_name       VARCHAR(255)    NOT NULL,
    role            user_role_enum  NOT NULL DEFAULT 'applicant',
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  users               IS 'Central user registry for applicants, reviewers, and admins.';
COMMENT ON COLUMN users.user_id       IS 'UUID primary key.';
COMMENT ON COLUMN users.email         IS 'Unique login/contact email.';
COMMENT ON COLUMN users.full_name     IS 'Display name of the user.';
COMMENT ON COLUMN users.role          IS 'Access role: applicant | reviewer | admin.';
COMMENT ON COLUMN users.is_active     IS 'Soft-delete / account activation flag.';


-- -----------------------------------------------------------------------------
-- 2.2  internship_types
--      Master catalogue of internship categories.
--      E.g. FREE, PAID, STIPEND, INDUSTRIAL, CORPORATE, RESEARCH
-- -----------------------------------------------------------------------------
CREATE TABLE internship_types (
    internship_type_id  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    type_code           VARCHAR(50)     NOT NULL UNIQUE,
    type_name           VARCHAR(100)    NOT NULL,
    description         TEXT,
    is_active           BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  internship_types                  IS 'Master list of internship categories (FREE, PAID, STIPEND, INDUSTRIAL, CORPORATE, RESEARCH).';
COMMENT ON COLUMN internship_types.type_code        IS 'Short unique code, e.g. FREE, PAID, STIPEND.';
COMMENT ON COLUMN internship_types.type_name        IS 'Human-readable name of the internship type.';


-- -----------------------------------------------------------------------------
-- 2.3  internship_openings
--      Specific internship roles/positions posted under a type.
--      One type can have many openings.
-- -----------------------------------------------------------------------------
CREATE TABLE internship_openings (
    opening_id              UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    internship_type_id      UUID                NOT NULL
                                                    REFERENCES internship_types(internship_type_id)
                                                    ON DELETE RESTRICT,
    role_name               VARCHAR(255)        NOT NULL,
    role_description        TEXT,
    project_title           VARCHAR(255),
    duration_weeks          INT                 CHECK (duration_weeks > 0),
    stipend_amount          NUMERIC(12, 2)      CHECK (stipend_amount >= 0),
    fee_amount              NUMERIC(12, 2)      CHECK (fee_amount >= 0),
    total_openings          INT                 NOT NULL CHECK (total_openings > 0),
    application_deadline    DATE,
    status                  opening_status_enum NOT NULL DEFAULT 'active',
    created_by              UUID                REFERENCES users(user_id)
                                                    ON DELETE SET NULL,
    created_at              TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  internship_openings                       IS 'Individual internship positions/roles posted under an internship type.';
COMMENT ON COLUMN internship_openings.stipend_amount        IS 'Amount (INR) paid to the intern — applicable for STIPEND type.';
COMMENT ON COLUMN internship_openings.fee_amount            IS 'Amount (INR) charged from applicant — applicable for PAID type.';
COMMENT ON COLUMN internship_openings.total_openings        IS 'Number of seats available for this opening.';
COMMENT ON COLUMN internship_openings.application_deadline  IS 'Last date to submit applications for this opening.';
COMMENT ON COLUMN internship_openings.created_by            IS 'Admin/reviewer who created the opening.';


-- -----------------------------------------------------------------------------
-- 2.4  applications
--      Core application record linking an applicant to an opening.
--      All type-specific detail tables and the profile hang off this table.
-- -----------------------------------------------------------------------------
CREATE TABLE applications (
    application_id      UUID                        PRIMARY KEY DEFAULT gen_random_uuid(),
    opening_id          UUID                        NOT NULL
                                                        REFERENCES internship_openings(opening_id)
                                                        ON DELETE RESTRICT,
    applicant_user_id   UUID                        NOT NULL
                                                        REFERENCES users(user_id)
                                                        ON DELETE RESTRICT,
    application_status  application_status_enum     NOT NULL DEFAULT 'draft',
    applied_at          TIMESTAMPTZ                 NOT NULL DEFAULT NOW(),
    reviewed_at         TIMESTAMPTZ,
    reviewed_by         UUID                        REFERENCES users(user_id)
                                                        ON DELETE SET NULL,
    remarks             TEXT,

    -- An applicant can apply only once per opening
    CONSTRAINT uq_application_unique UNIQUE (opening_id, applicant_user_id)
);

COMMENT ON TABLE  applications                      IS 'Core application record: one row per applicant per opening.';
COMMENT ON COLUMN applications.applicant_user_id    IS 'The user who submitted this application.';
COMMENT ON COLUMN applications.reviewed_by          IS 'Reviewer/admin who last updated the status.';
COMMENT ON COLUMN applications.remarks              IS 'Internal notes or feedback from the reviewer.';
COMMENT ON CONSTRAINT uq_application_unique
    ON applications                                 IS 'Prevents duplicate applications for the same opening.';


-- -----------------------------------------------------------------------------
-- 2.5  application_profiles
--      Personal, academic, and professional information submitted with an
--      application. 1:1 with applications.
-- -----------------------------------------------------------------------------
CREATE TABLE application_profiles (
    application_profile_id  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id          UUID            NOT NULL UNIQUE
                                                REFERENCES applications(application_id)
                                                ON DELETE CASCADE,

    -- Personal Information
    first_name              VARCHAR(100)    NOT NULL,
    last_name               VARCHAR(100)    NOT NULL,
    email                   VARCHAR(255)    NOT NULL,
    mobile_number           VARCHAR(20)     NOT NULL,
    date_of_birth           DATE,
    gender                  VARCHAR(20),
    city                    VARCHAR(100)    NOT NULL,
    state                   VARCHAR(100)    NOT NULL,

    -- Academic Information
    college_name            VARCHAR(255)    NOT NULL,
    department              VARCHAR(150)    NOT NULL,
    degree                  VARCHAR(100)    NOT NULL,
    current_year            SMALLINT        NOT NULL CHECK (current_year BETWEEN 1 AND 7),
    cgpa_percentage         NUMERIC(5, 2)   NOT NULL CHECK (cgpa_percentage >= 0 AND cgpa_percentage <= 100),
    graduation_year         SMALLINT        NOT NULL,

    -- Professional Information
    skills                  TEXT            NOT NULL,
    github_url              TEXT,
    linkedin_url            TEXT,
    portfolio_url           TEXT,
    project_experience      TEXT,

    -- Motivation
    motivation_statement    TEXT            NOT NULL
);

COMMENT ON TABLE  application_profiles                  IS 'Complete applicant profile snapshot submitted with the application (1:1 with applications).';
COMMENT ON COLUMN application_profiles.email            IS 'Contact email provided in the application form (may differ from users.email).';
COMMENT ON COLUMN application_profiles.cgpa_percentage IS 'CGPA (0-10 scale) or percentage (0-100). Interpretation is context-dependent.';
COMMENT ON COLUMN application_profiles.current_year    IS 'Current year of study (1 through 7 to allow for extended programmes).';
COMMENT ON COLUMN application_profiles.motivation_statement IS 'Answer to "Why do you want this internship?".';


-- -----------------------------------------------------------------------------
-- 2.6  application_documents
--      File attachments associated with an application (e.g. Resume PDF).
--      1:M with applications — one application can have multiple documents.
-- -----------------------------------------------------------------------------
CREATE TABLE application_documents (
    document_id     UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id  UUID            NOT NULL
                                        REFERENCES applications(application_id)
                                        ON DELETE CASCADE,
    document_type   VARCHAR(50)     NOT NULL,   -- e.g. 'resume', 'payment_screenshot'
    file_name       VARCHAR(255)    NOT NULL,
    mime_type       VARCHAR(100)    NOT NULL,
    file_size       BIGINT          NOT NULL CHECK (file_size > 0),
    file_data       BYTEA           NOT NULL,   -- Actual binary content of the file
    uploaded_at     TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  application_documents                 IS 'Binary file attachments for an application (resume, screenshots, etc.).';
COMMENT ON COLUMN application_documents.document_type  IS 'Semantic label: resume | payment_screenshot | other.';
COMMENT ON COLUMN application_documents.file_data      IS 'Raw binary content stored in the database via BYTEA.';
COMMENT ON COLUMN application_documents.file_size      IS 'File size in bytes — validated on insert.';


-- =============================================================================
-- SECTION 3: TYPE-SPECIFIC DETAIL TABLES (0:1 with applications)
-- =============================================================================
-- Each of these tables stores the EXTRA fields required only for a specific
-- internship type. If an application is for a FREE or CORPORATE internship,
-- no row exists in any of these tables.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 3.1  paid_application_details
--      Extra fields for PAID internship applications.
--      payment_document_id references the application_documents table for the
--      payment screenshot file.
-- -----------------------------------------------------------------------------
CREATE TABLE paid_application_details (
    paid_application_id     UUID                    PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id          UUID                    NOT NULL UNIQUE
                                                        REFERENCES applications(application_id)
                                                        ON DELETE CASCADE,
    fee_acceptance          BOOLEAN                 NOT NULL DEFAULT FALSE,
    payment_mode            payment_mode_enum       NOT NULL,
    transaction_id          VARCHAR(255),
    payment_status          payment_status_enum     NOT NULL DEFAULT 'pending',
    payment_document_id     UUID                    REFERENCES application_documents(document_id)
                                                        ON DELETE SET NULL
);

COMMENT ON TABLE  paid_application_details                      IS 'Payment details for PAID internship applications (0:1 with applications).';
COMMENT ON COLUMN paid_application_details.fee_acceptance       IS 'Checkbox confirming applicant has read and accepted the fee terms.';
COMMENT ON COLUMN paid_application_details.transaction_id       IS 'Transaction/UTR reference number. Required when payment_mode is not NULL.';
COMMENT ON COLUMN paid_application_details.payment_document_id IS 'FK to application_documents for the payment screenshot upload.';


-- -----------------------------------------------------------------------------
-- 3.2  stipend_application_details
--      Extra field for STIPEND internship applications.
-- -----------------------------------------------------------------------------
CREATE TABLE stipend_application_details (
    stipend_application_id  UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id          UUID    NOT NULL UNIQUE
                                        REFERENCES applications(application_id)
                                        ON DELETE CASCADE,
    relevant_experience     TEXT    NOT NULL
);

COMMENT ON TABLE  stipend_application_details                       IS 'Additional details for STIPEND internship applications (0:1 with applications).';
COMMENT ON COLUMN stipend_application_details.relevant_experience   IS 'Applicant description of experience relevant to this stipend role.';


-- -----------------------------------------------------------------------------
-- 3.3  industrial_application_details
--      Extra fields for INDUSTRIAL internship applications.
-- -----------------------------------------------------------------------------
CREATE TABLE industrial_application_details (
    industrial_application_id       UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id                  UUID    NOT NULL UNIQUE
                                                REFERENCES applications(application_id)
                                                ON DELETE CASCADE,
    preferred_technology_stack      TEXT    NOT NULL,
    relevant_technical_experience   TEXT    NOT NULL
);

COMMENT ON TABLE  industrial_application_details                                IS 'Additional details for INDUSTRIAL internship applications (0:1 with applications).';
COMMENT ON COLUMN industrial_application_details.preferred_technology_stack     IS 'Technologies/frameworks the applicant prefers to work with.';
COMMENT ON COLUMN industrial_application_details.relevant_technical_experience  IS 'Applicant description of relevant technical project/work experience.';


-- -----------------------------------------------------------------------------
-- 3.4  corporate_application_details
--      Marker table for CORPORATE SPONSORED internship applications.
--      No extra fields required per specification — existence of a row in this
--      table flags that the application is corporate-sponsored.
-- -----------------------------------------------------------------------------
-- CREATE TABLE corporate_application_details (
--     corporate_application_id    UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
--     application_id              UUID    NOT NULL UNIQUE
--                                             REFERENCES applications(application_id)
--                                             ON DELETE CASCADE
-- );

-- COMMENT ON TABLE  corporate_application_details IS 'Marker table for CORPORATE SPONSORED internship applications. No extra fields — presence of a row is the flag.';


-- -----------------------------------------------------------------------------
-- 3.5  research_application_details
--      Extra fields for RESEARCH internship applications.
-- -----------------------------------------------------------------------------
CREATE TABLE research_application_details (
    research_application_id     UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id              UUID            NOT NULL UNIQUE
                                                    REFERENCES applications(application_id)
                                                    ON DELETE CASCADE,
    research_area_of_interest   VARCHAR(255)    NOT NULL,
    research_interest_statement TEXT            NOT NULL,
    publications_available      BOOLEAN         NOT NULL DEFAULT FALSE,
    publication_links           TEXT
);

COMMENT ON TABLE  research_application_details                          IS 'Additional details for RESEARCH internship applications (0:1 with applications).';
COMMENT ON COLUMN research_application_details.publications_available   IS 'TRUE if the applicant has published research papers.';
COMMENT ON COLUMN research_application_details.publication_links        IS 'Comma-separated or newline-separated URLs to publications. Required when publications_available = TRUE.';


-- =============================================================================
-- SECTION 4: INDEXES
-- =============================================================================

-- users
CREATE INDEX idx_users_email          ON users (email);
CREATE INDEX idx_users_role           ON users (role);

-- internship_types
CREATE INDEX idx_internship_types_code      ON internship_types (type_code);
CREATE INDEX idx_internship_types_active    ON internship_types (is_active);

-- internship_openings
CREATE INDEX idx_openings_type_id           ON internship_openings (internship_type_id);
CREATE INDEX idx_openings_status            ON internship_openings (status);
CREATE INDEX idx_openings_deadline          ON internship_openings (application_deadline);
CREATE INDEX idx_openings_created_by        ON internship_openings (created_by);

-- applications
CREATE INDEX idx_applications_opening_id    ON applications (opening_id);
CREATE INDEX idx_applications_applicant     ON applications (applicant_user_id);
CREATE INDEX idx_applications_status        ON applications (application_status);
CREATE INDEX idx_applications_applied_at    ON applications (applied_at DESC);
CREATE INDEX idx_applications_reviewed_by   ON applications (reviewed_by);

-- application_profiles
CREATE INDEX idx_profiles_application_id    ON application_profiles (application_id);
CREATE INDEX idx_profiles_email             ON application_profiles (email);
CREATE INDEX idx_profiles_college           ON application_profiles (college_name);

-- application_documents
CREATE INDEX idx_documents_application_id   ON application_documents (application_id);
CREATE INDEX idx_documents_type             ON application_documents (document_type);

-- type-specific detail tables (FK indexes)
CREATE INDEX idx_paid_detail_app_id         ON paid_application_details (application_id);
CREATE INDEX idx_paid_detail_pay_status     ON paid_application_details (payment_status);
CREATE INDEX idx_stipend_detail_app_id      ON stipend_application_details (application_id);
CREATE INDEX idx_industrial_detail_app_id   ON industrial_application_details (application_id);
-- CREATE INDEX idx_corporate_detail_app_id    ON corporate_application_details (application_id);
CREATE INDEX idx_research_detail_app_id     ON research_application_details (application_id);


-- =============================================================================
-- SECTION 5: updated_at TRIGGER (for users table)
-- =============================================================================

-- Automatically update updated_at on the users table on every UPDATE
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();


-- =============================================================================
-- END OF SCHEMA
-- =============================================================================
