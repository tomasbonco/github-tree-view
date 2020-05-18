export enum EFileState { ADDED, UPDATED, RENAMED, DELETED };
// export enum EDisplayModes { PLAIN_FILES, FOLDER_STRUCTURE }

/*
export interface IState
{
    settings:
    {
        showWhenSingleChange: boolean;
        sortFilesBy: number; // TODO
    };

	fileFilter: string;
    filesPlain: IFile[];
    folderStructure: IFolder;

	displayMode: EDisplayModes;
    activeFile: string;
}
*/

export interface IFile
{
	path: string;
	hash: string;
	isCommented: boolean;
	changeType: EFileState;
	additions: number;
	deletions: number;
}
