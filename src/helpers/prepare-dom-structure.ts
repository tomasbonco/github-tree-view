import '../views/gtw-file-browser'
import '../views/gtw-wrapper'
import { attachToElement } from '../views/lit-wrapper';
import { GtwWrapper } from '../views/gtw-wrapper';
import { GtwFileBrowser } from '../views/gtw-file-browser';
import { createEllipsis } from './create-ellipsis';

export function prepareDomStructure()
{
	console.log( 'Prepare DOM structure' )
	const files = document.querySelector( '#files' ) || (() => { throw new Error( `<#files> element can't be found on current page.`) } )();
	const parentNode = files.parentElement || (() => { throw new Error( `<#files> element doesn't have parentElement. Weird right?`) } )()
	const nextNode = files.nextSibling;

	const wrapper = document.createElement( 'div' );
	wrapper.classList.add( 'gtw-wrapper' );
	attachToElement( wrapper, GtwWrapper );

	const fileBrowser = document.createElement( 'div' );
	fileBrowser.classList.add( 'gtw-file-browser' );
	attachToElement( fileBrowser, GtwFileBrowser );

	wrapper.appendChild( fileBrowser );
	wrapper.appendChild( files ); // this removes element from Github's page
	
	parentNode.insertBefore( wrapper, nextNode );

	return fileBrowser;
}