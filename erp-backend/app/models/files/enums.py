import enum

class FileStatusEnum(str, enum.Enum):
    DRAFT = "Draft"
    ACTIVE = "Active"
    ARCHIVED = "Archived"
    DELETED = "Deleted"

class AccessLevelEnum(str, enum.Enum):
    PUBLIC = "Public"
    INTERNAL = "Internal"
    RESTRICTED = "Restricted"

class StorageProviderEnum(str, enum.Enum):
    LOCAL = "Local"
    S3 = "S3"
    AZURE = "Azure"
    GCS = "GCS"
