import { Role } from "../../entity";
import { RoleModel } from "../schema";
import { roleEntityToRoleRecord, roleRecordToRoleEntity, rolesRecordsToRolesEntities } from "./transformer";

export class RolePersistor {
    async createOrUpdateRole(role: Role): Promise<Role> {
        return new Promise<Role>(async (resolve, reject) => {
            try {
                let roleData = roleEntityToRoleRecord(role);
                let roleRecord = await RoleModel.findOneAndUpdate(
                    { name: roleData.name }, // Search criteria
                    {
                        $set: {
                            description: roleData.description,
                            isSystemRole: roleData.isSystemRole,
                            permissions: roleData.permissions
                        }
                    },
                    {
                        upsert: true,     // Create if doesn't exist
                        new: true,        // Return the updated doc
                        runValidators: true
                    }
                );
                resolve(await roleRecordToRoleEntity(roleRecord))
            } catch (error) {
                reject(error)
            }
        });
    }

    async getRoles(): Promise<Role[]> {
        return new Promise<Role[]>(async (resolve, reject) => {
            try {
                let rolesRecords = await RoleModel.find();
                resolve(await rolesRecordsToRolesEntities(rolesRecords));
            } catch (error) {
                reject(error);
            }
        });
    }

    async getRoleByName(name: string): Promise<Role> {
        return new Promise<Role>(async (resolve, reject) => {
            try {
                let roleRecord = await RoleModel.findOne({
                    name: name
                });
                resolve(await roleRecordToRoleEntity(roleRecord));
            } catch (error) {
                reject(error);
            }
        });
    }
}