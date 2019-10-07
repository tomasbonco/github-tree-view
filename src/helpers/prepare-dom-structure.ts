export function prepareDomStructure()
{
	const files = document.querySelector( '#files' ) || (() => { throw new Error( `<#files> element can't be found on current page.`) } )();
	const parentNode = files.parentNode || (() => { throw new Error( `<#files> element doesn't have parentNode. Weird right?`) } )()
	const nextNode = files.nextSibling;

	const wrapper = document.createElement( 'div' );
	wrapper.id = 'github-plugin__wrapper';

	const leftElement = document.createElement( 'div' );
	leftElement.id = 'github-plugin__file-browser';

	wrapper.appendChild( leftElement );
	wrapper.appendChild( files ); // this removes element from Github's page
	
	parentNode.insertBefore( wrapper, nextNode );

	return leftElement;
}