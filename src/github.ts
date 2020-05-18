/**
 * Returns `true`, if current website is Github.com or Github Enterprise.
 */
export function isGithub()
{
	return !! document.querySelector( 'head link[title="GitHub"]' );
}


/**
 * Adds missing listener for History.pushState() event.
 * Read more: https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
 * 
 * @param callback
 * @param interval 
 */
export function onPushState( callback: ( newUrl: string, oldUrl: string ) => void, interval: number = 150 ): void
{
	let oldUrl = document.location.pathname;

	setInterval( () =>
	{
		const newUrl = document.location.pathname;

		if ( newUrl !== oldUrl )
		{
			callback( newUrl, oldUrl );
			oldUrl = newUrl;
		}

	}, interval );
}


/**
 * Makes body wider. Source code is then much more readable.
 */
export function expandBody()
{
	const body = document.body;
	const bodyClasses = Array.from( body.classList )

	// If body is not narrow, there is no reason to continue
	if ( bodyClasses.includes( 'full-width' ) )
	{
		return;
	}
	
	// Remove classes causing narrow body
	bodyClasses.forEach( bc =>
	{
		if ( bc.startsWith( 'min-width' ) )
		{
			body.classList.remove( bc )
			body.classList.add( `gtw-removed-${ bc }` );
		}
	});

	// Add a class creating wide body
	body.classList.add( 'full-width', 'gtw-expanded' );
}


/**
 * Narrows body width, if it was expanded.
 */
export function resetBodyWidth()
{
	const body = document.body;
	const bodyClasses = Array.from( body.classList )

	if ( ! bodyClasses.includes( 'gtw-expanded' ) )
	{
		return;
	}
	
	// Remove classes causing wide body
	bodyClasses.forEach( bc =>
	{
		if ( bc.startsWith( 'gtw-removed-' ) )
		{
			body.classList.remove( bc )
			body.classList.add( bc.substr( 'gtw-removed-'.length ) );
		}
	});

	// Add a class creating wide body
	body.classList.remove( 'full-width', 'gtw-expanded' );
}

/**
 * This will double click on Table Of Content button. It contains a list of all files,
 * that we cannot load otherwise, because Github uses lazy loading.
 */
export function preloadToc()
{
	const tocSelectElement: HTMLElement|null = document.querySelector('.pr-toolbar .toc-select .select-menu-button')
		
	if ( tocSelectElement )
	{
		tocSelectElement.click()
		tocSelectElement.click()
	}
}