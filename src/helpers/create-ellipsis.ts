export function createEllipsis( target: HTMLElement )
{
	const text: string = target.innerText;
	const halfLength = Math.floor( text.length / 2 );
	const parts = [ text.substr( 0, halfLength ), text.substr( halfLength ) ];

	let eat = 3;

	const makeTextShorter = ()=>
	{
		if ( target.scrollWidth > target.clientWidth )
		{
			const newParts = [
				parts[0].substr( 0, parts[0].length - eat ),
				parts[1].substr( eat )
			];

			target.innerText = newParts.join('…');
			eat++;

			return requestAnimationFrame( makeTextShorter );
		}

		return false;
	}

	requestAnimationFrame( makeTextShorter );
}