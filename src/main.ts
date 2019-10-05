import App from './views/App.svelte';
import { prepareDomStructure } from './helpers/prepare-dom-structure';
import { scrape } from './scrappers/latest';
import { files } from './store';

try
{
	const scrappedFiles = scrape();
	files.set( scrappedFiles );
	
	const fileBrowser = prepareDomStructure();

	const app = new App(
	{
		target: fileBrowser,
		props: {}
	});
}

catch ( e )
{
	console.groupCollapsed( `GitHub Tree View extension can't run on this webpage.` );
	console.error( e );
	console.groupEnd();
}
