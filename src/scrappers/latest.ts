import { IFile, EFileState } from "../interfaces";
import { expandPath } from "../helpers/expand-path";

export function scrape(): IFile[]
{
	// Metadatas from Table of Content (when you expand `Showing X changed files with Y
	// additions and Z deletions.`) contain additional information about file (like
	// additions/deletions, type of change and so on), but cannot be used to obtain
	// file's path. This work on Github.com
	const toc: HTMLLIElement[] = Array.from( document.querySelectorAll( '#toc li' ) );

	// Metadatas from <detail-menu> are similar, but available in Github Enterprise.
	const detailsMenu: HTMLAnchorElement[] = Array.from( document.querySelectorAll( 'details-menu .toc-menu-item' ) )

	// FileHolders represent actual elements on page where diff is shown for given file.
	// They are used to get file's path.
	const fileHolders: HTMLDivElement[] = Array.from( document.querySelectorAll( '.file' ) );

	
	/** GitHub is loading contend lazily */
	if ( Math.max( toc.length, detailsMenu.length ) !== fileHolders.length || fileHolders.length === 0 )
	{
		console.info( toc.length, detailsMenu.length, fileHolders.length )
		return [];
	}


	const tocExtract = toc.map( item =>
	{
		const aElement = item.querySelector( 'a' ) || (() => { throw new Error( `<a> element can't be found inside one of <#toc li> element.`) } )();
		const svgElement = item.querySelector( 'svg' ) || (() => { throw new Error( `<svg> element can't be found inside one of <#toc li> element.`) } )();
		const additionsElement: HTMLSpanElement = item.querySelector( '.diffstat .text-green' ) || (() => { throw new Error( `<.text-green> element can't be found inside one of <#toc li> element.`) } )();
		const deletionsElement: HTMLSpanElement = item.querySelector( '.diffstat .text-red' ) || (() => { throw new Error( `<.text-red> element can't be found inside one of <#toc li> element.`) } )();

		// Hash
		const hash = aElement.getAttribute( 'href' ) || '';

		// Change Type
		const changeType = getChangeTypeFromSvg( svgElement );
		
		// Additions & Deletions
		const additions = parseInt( additionsElement.innerText.trim() );
		const deletions = parseInt( deletionsElement.innerText.trim().replace('−', '-') );

		return {
			hash,
			changeType,
			additions,
			deletions
		}
	})


	const detailsMenuExtract = detailsMenu.map( item =>
	{
		const svgElement: SVGElement = item.querySelector( 'svg.select-menu-item-icon' ) || (() => { throw new Error( `<svg> element can't be found inside one of <details-menu .toc-menu-item> element.`) } )();
		const additionsElement: HTMLSpanElement = item.querySelector( 'span .text-green' ) || (() => { throw new Error( `<.text-green> element can't be found inside one of <details-menu .toc-menu-item> element.`) } )();
		const deletionsElement: HTMLSpanElement = item.querySelector( 'span.text-red' ) || (() => { throw new Error( `<.text-red> element can't be found inside one of <details-menu .toc-menu-item> element.`) } )();


		// Hash
		const hash = item.getAttribute( 'href' ) || '';

		// Change Type
		const changeType = getChangeTypeFromSvg( svgElement );

		// Additions & Deletions
		const additions = parseInt( additionsElement.innerText.trim() );
		const deletions = parseInt( deletionsElement.innerText.trim().replace('−', '-') );

		return {
			hash,
			changeType,
			additions,
			deletions
		}
	})


	const fileHoldersExtract = fileHolders.map( item =>
	{
		const filePathElement: HTMLAnchorElement = item.querySelector( '.file-info a' ) || (() => { throw new Error( `<.file-info a> element can't be found inside one of <.file> element.`) } )();

		// Hash
		const hash = filePathElement.getAttribute( 'href' ) || '';

		// Path
		const pathRaw = ( filePathElement.getAttribute( 'title' ) || filePathElement.innerText )
		const path = ( pathRaw.split('→').pop() as string ).trim(); // returns renamed file name or just filename, if file was not renamed

		const { dir, base, ext } = expandPath( path );

		return { hash, dir, base, ext, path }
	}).reduce(
		( prev, curr ) => { prev[ curr.hash ] = curr; return prev; }, // reduces array into object
		{} as { [hash: string]: { hash: string, dir: string, base: string, ext: string, path: string } } // intial value
	)

	
	const metadatas = tocExtract.length > detailsMenuExtract.length ? tocExtract : detailsMenuExtract;

	return metadatas.map( metadata =>
	({
		isCommented: false,
		...metadata,
		...fileHoldersExtract[ metadata.hash ]
	}) )
}

function getChangeTypeFromSvg( svgElement: SVGElement ): EFileState
{
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

	return changeType;
}