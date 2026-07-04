import asyncio
import os
from dotenv import load_dotenv
load_dotenv()
import re
import re
from uuid import uuid4
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal
from app.models.rbac.module import Module
from app.models.rbac.feature import Feature
from app.models.rbac.permission import Permission
from app.models.rbac.action import Action

async def upload_modules():
    frontend_path = "../frontend/src/core/features/feature-registry.ts"
    
    with open(frontend_path, "r") as f:
        content = f.read()

    # Find the FEATURE_REGISTRY array
    pattern = r"\{\s*moduleId:\s*'([^']+)',\s*featureId:\s*'([^']+)',\s*permissionKey:\s*'([^']+)',\s*displayName:\s*'([^']+)',\s*navigationLabel:\s*'([^']+)',\s*route:\s*'([^']+)'"
    matches = re.findall(pattern, content)
    
    async with AsyncSessionLocal() as db:
        print(f"Found {len(matches)} modules in frontend registry.")
        
        # Ensure all actions exist
        actions_list = ["read", "create", "update", "delete", "manage", "export"]
        for act in actions_list:
            act_obj = (await db.execute(select(Action).where(Action.code == act))).scalars().first()
            if not act_obj:
                act_obj = Action(
                    id=uuid4(),
                    name=act.capitalize(),
                    code=act,
                    description=f"{act.capitalize()} records"
                )
                db.add(act_obj)
        await db.commit()
        
        actions_map = {
            a.code: a for a in (await db.execute(select(Action))).scalars().all()
        }

        for (module_id, feature_id, perm_key, display_name, nav_label, route) in matches:
            # 1. Create or get Module
            module_obj = (await db.execute(select(Module).where(Module.code == module_id))).scalars().first()
            if not module_obj:
                print(f"Adding module: {module_id} - {display_name}")
                module_obj = Module(
                    id=uuid4(),
                    name=display_name,
                    code=module_id,
                    description=f"{display_name} module",
                    route_path=route
                )
                db.add(module_obj)
                await db.flush()
            
            # 2. Create or get Feature
            feat_obj = (await db.execute(select(Feature).where(Feature.code == f"{module_id}_access"))).scalars().first()
            if not feat_obj:
                feat_obj = Feature(
                    id=uuid4(),
                    module_id=module_obj.id,
                    name=f"{display_name} Access",
                    code=f"{module_id}_access",
                    description=f"Access control for {display_name}"
                )
                db.add(feat_obj)
                await db.flush()
            
            # 3. Create Permissions
            # We only want to generate view, create, update, delete, manage, export
            target_actions = ["view", "create", "update", "delete", "manage", "export"]
            
            for act_code in target_actions:
                act_obj = actions_map.get(act_code)
                if not act_obj:
                    # Try fallback to 'read' if 'view' doesn't exist
                    if act_code == "view":
                        act_obj = actions_map.get("read")
                
                if not act_obj:
                    continue
                    
                perm_code = f"{module_id}.{act_code}"
                perm_obj = (await db.execute(select(Permission).where(Permission.code == perm_code))).scalars().first()
                if not perm_obj:
                    perm_obj = Permission(
                        id=uuid4(),
                        feature_id=feat_obj.id,
                        action_id=act_obj.id,
                        name=perm_code,
                        code=perm_code,
                        description=f"{act_obj.name} permission for {feat_obj.name}"
                    )
                    db.add(perm_obj)
                    await db.flush()
        
        await db.commit()
        print("Upload complete!")

if __name__ == "__main__":
    asyncio.run(upload_modules())
