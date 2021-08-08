export interface IOptions {
    directory?: string;
    database?: {
        url: string;
    };
}
export interface IObject {
    [index: string]: any;
}
export interface IOptionsLoad {
    id: string;
    force: boolean;
}
export interface IBackup {
    _id: string;
    backupID: string;
    backupOwner: string;
    gID: string;
    gName: string;
    gDescription: string;
    gIcon: string;
    gBans: Array<any>;
    gCategories: Array<any>;
    gChannels: Array<any>;
    gEmojis: Array<any>;
    gRoles: Array<any>;
}
