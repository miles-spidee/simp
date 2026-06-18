import os

base_dir = "/mnt/stuffs/PROJECTS/pinesphere/simp/pinesphere_erp/lib"

folders = [
    "core/constants",
    "core/network",
    "core/routes",
    "core/storage",
    "core/theme",
    "core/utils",
    "core/widgets",
    "features/auth/screens",
    "features/auth/widgets",
    "features/auth/models",
    "features/auth/providers",
    "features/auth/services",
    "features/dashboard/screens",
    "features/dashboard/widgets",
    "features/dashboard/models",
    "features/dashboard/providers",
    "features/dashboard/services",
    "features/profile/screens",
    "features/attendance/screens",
    "features/tasks/screens",
    "features/assessments/screens",
    "features/certificates/screens",
    "features/notifications/screens",
    "features/settings/screens",
    "shared/models",
    "shared/widgets",
]

for folder in folders:
    os.makedirs(os.path.join(base_dir, folder), exist_ok=True)

print("Folders created successfully.")
