import { writable, derived, Writable, Readable } from 'svelte/store';
import { IFile, IFolder } from './scrappers/interface';
import { listDirectories } from './helpers/list-directories';
import { getRandomId } from './helpers/get-random-id';

export const files: Writable<IFile[]> = writable( [] );
export const treeStructure: Readable<IFolder> = derived( files, $files =>
{
    const entryFolder: IFolder = getEmptyFolder();

    $files.forEach( file => insertFile( file, entryFolder, listDirectories( file.path ) ) )
    optimizeStructure( entryFolder );

    return entryFolder;
})


function getEmptyFolder(): IFolder
{
    return {
        id: getRandomId(),
        name: '',
        subfolders: [],
        files: [],
        isExpanded: true
    }
}


function insertFile( file: IFile, currentFolder: IFolder, remainingPath: string[] ): void
{
    if ( remainingPath.length === 0 )
    {
        currentFolder.files.push( file );
        return
    }


    const nextSubFolder: string = remainingPath.shift() as string;
    const subFolder = currentFolder.subfolders.find( sf => sf.name === nextSubFolder );

    if ( subFolder )
    {
        return insertFile( file, subFolder, remainingPath );
    }


    const newSubFolder = getEmptyFolder();
    newSubFolder.name = nextSubFolder;

    currentFolder.subfolders.push( newSubFolder );
    
    return insertFile( file, newSubFolder, remainingPath );
}


function optimizeStructure( folder: IFolder ): void
{
    if ( folder.subfolders.length === 0 )
    {
        return
    }

    if ( folder.files.length > 0 || folder.subfolders.length > 1 )
    {
        return folder.subfolders.forEach( sf => optimizeStructure( sf ));
    }


    // it has 1 subfolder and no files

    const subfolder = folder.subfolders[0];

    folder.subfolders = subfolder.subfolders;
    folder.files = subfolder.files;
    folder.name += folder.name ? `/${subfolder.name}` : subfolder.name;
    
    optimizeStructure( folder );
}