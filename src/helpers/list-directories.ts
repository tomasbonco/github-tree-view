import { expandPath } from "./expand-path";

export function listDirectories( path: string ): string[]
{
    const {dir} = expandPath( path );
    return dir.split( /[\/\\]/ );
}