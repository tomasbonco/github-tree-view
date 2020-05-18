import { prepareDomStructure } from './helpers/prepare-dom-structure';
import * as Github from './github'


( () =>
{
	if ( ! Github.isGithub() )
	{
		return;
	}

	console.log( '[GitHub Tree View]', 'GitHub detected.' )
	Github.onPushState( onPushState )

	onPushState( location.pathname );
})()


function onPushState( newPath: string ): void
{
	console.log( 'URL changed' )
	Github.resetBodyWidth();

	const isPR = newPath.endsWith( '/files' );
	const isCommit = newPath.match( /\/commits?\/[^\/]+$/ )
	const isPluginAttached = document.querySelector( '#github-plugin__wrapper' );

	if ( ( isPR || isCommit ) && ! isPluginAttached )
	{
		bootstrap();
	}
}


async function bootstrap()
{
	console.log( 'Bootstrapped!' );

	Github.expandBody();

	const maxAttempts = 7;
	let interval = 60;
	let attempts: number = 0;

	const tryToDisplay = () =>
	{
		try
		{
			prepareDomStructure();
			Github.preloadToc();
		}

		catch ( e )
		{
			console.log( e );

			if ( ++attempts >= maxAttempts ) { return; }
			console.log( `Github Tree View will attempt to read content again in ${ interval }ms.` );

			setTimeout( tryToDisplay, interval );
			interval *= 2;
		}
	}

	tryToDisplay();
}