import { IFile, EFileState } from "./interface";
import { expandPath } from "../helpers/expand-path";

export function scrape(): IFile[]
{
	// Metadatas are from Table o Content (when you expand `Showing X changed files with Y
	// additions and Z deletions.`) and usually contain additional information about file
	// (like addition/deletions, type of change and so on), but cannot be used to obtain
	// file's path.
	const metadatas: HTMLLIElement[] = Array.from( document.querySelectorAll( '#toc li' ) );

	// FileHolders represent actual elements on page where diff is shown for given file.
	// They are used to get file's path.
	const fileHolders: HTMLDivElement[] = Array.from( document.querySelectorAll( '.file' ) );


	if ( metadatas.length === 0 || metadatas.length !== fileHolders.length )
	{
		return [];
	}

	
	const files: IFile[] = metadatas.map(( liElement, index ) =>
	{
		const fileHolder = fileHolders[ index ];
		const aElement = liElement.querySelector( 'a' ) || (() => { throw new Error( `<a> element can't be found inside one of <#toc li> element.`) } )();
		const svgElement = liElement.querySelector( 'svg' ) || (() => { throw new Error( `<svg> element can't be found inside one of <#toc li> element.`) } )();
		const additionsElement: HTMLSpanElement = liElement.querySelector( '.diffstats .text-green' ) || (() => { throw new Error( `<.text-green> element can't be found inside one of <#toc li> element.`) } )();
		const deletionsElement: HTMLSpanElement = liElement.querySelector( '.diffstats .text-red' ) || (() => { throw new Error( `<.text-red> element can't be found inside one of <#toc li> element.`) } )();
		const filePathElement: HTMLAnchorElement = fileHolder.querySelector( '.file-info a' ) || (() => { throw new Error( `<.file-info a> element can't be found inside one of <.file> element.`) } )();

		// Path
		const pathRaw = ( filePathElement.getAttribute( 'title' ) || filePathElement.innerText )
		const path = ( pathRaw.split('→').pop() as string ).trim(); // returns renamed file name or just filename, if file was not renamed

		const { dir, base, ext } = expandPath( path );

		// Hash
		const hash = aElement.getAttribute( 'href' ) || '';

		// Change Type
		let changeType: EFileState;

		switch ( svgElement.getAttribute( 'title' ) )
		{
			case 'removed':
				changeType = EFileState.DELETED;
				break;

			case 'added':
				changeType = EFileState.ADDED;
				break;

			case 'renamed':
				changeType = EFileState.RENAMED;
				break;

			default:
				changeType = EFileState.UPDATED;
				break;
		}

		// Additions & Deletions
		const additions = parseInt( additionsElement.innerText );
		const deletions = parseInt( deletionsElement.innerText );


		const file: IFile =
		{
			path,
			dir,
			base,
			ext,
			hash,
			isCommented: false, // currently not supported
			changeType,
			additions,
			deletions,
		}

		return file;
	})

	return files;
}