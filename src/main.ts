import App from './views/App.svelte';
import { prepareDomStructure } from './helpers/prepare-dom-structure';
import { scrape } from './scrappers/latest';

function bootstrap()
{
	try
	{
		const scrappedFiles = scrape();
		
		if ( scrappedFiles.length === 0 )
		{
			return true;
		}

		const fileBrowser = prepareDomStructure();

		const app = new App(
		{
			target: fileBrowser,
			props:
			{
				files: scrappedFiles
			}
		});

		return false
	}

	catch ( e )
	{
		console.groupCollapsed( `GitHub Tree View extension can't run on this webpage.` );
		console.error( e );
		console.groupEnd();
	}
}

function fixNarrowBody()
{
	const body =  document.body;
	const bodyClasses = Array.from( body.classList )

	// If body is not narrow, there is no reason to continue
	if ( bodyClasses.includes( 'full-width' ) )
	{
		return;
	}
	
	// Remove classes causing narrow body
	bodyClasses.forEach( bc => bc.startsWith( 'min-width' ) && body.classList.remove( bc ) );

	// Add a class creating wide body
	body.classList.add( 'full-width' );
}


function forceMetadataPresence()
{
	const tocSelectElement: HTMLElement|null = document.querySelector('.pr-toolbar .toc-select .select-menu-button')
		
	if ( tocSelectElement )
	{
		tocSelectElement.click()
		tocSelectElement.click()
	}
}



let interval: number;

function checkSiteChange(): void
{
	const files = document.querySelector( '#files' );
	const plugin = document.querySelector( '#github-plugin__wrapper' );

	if ( files && ! plugin )
	{
		fixNarrowBody();
		forceMetadataPresence();
		
		const isSuccessful = bootstrap();
		startCheckInterval( isSuccessful ? 3000 : 700 )
	}
}


function startCheckInterval( time: number ): void
{
	clearInterval( interval )
	interval = setInterval( () => checkSiteChange(), time );
}


( () =>
{
	const isGitHub = document.querySelector( 'head link[title="GitHub"]' );

	if ( ! isGitHub )
	{
		console.info( 'Not a Github page' );
		return;
	}

	startCheckInterval( 150 );
})()