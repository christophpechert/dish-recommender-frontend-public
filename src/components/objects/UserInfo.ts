import { UserRole } from "../config/constant";
import { Invite } from "./Invite";
import { UserGroup } from "./UserGroup";

export type UserInfo = {
    id?: number;
    name: string;
    password: string;
    email: string;
    role?: UserRole;
    created?: string;
    lastChange?: string;
    userGroup?: UserGroup;
    invites?: Invite[];
}