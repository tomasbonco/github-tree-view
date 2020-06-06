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
			if ( ++attempts >= maxAttempts ) { return; }

			setTimeout( tryToDisplay, interval );
			interval *= 2;
		}
	}

	tryToDisplay();
}