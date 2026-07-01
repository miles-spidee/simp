import enum

class StatusEnum(str, enum.Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"
    PENDING = "PENDING"
    ARCHIVED = "ARCHIVED"
    SUSPENDED = "SUSPENDED"
