export function expandPath( path: string )
{
    const [_, __, dir, base, ext] = path.match( /^((.*)[\/\\])?([^\/\\]+?)\.([a-zA-Z0-9\-\_$]+)$/  ) as string[];
    return { dir, base, ext };
}