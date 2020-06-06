import { scrape } from '../scrappers/latest';
import { Manager, Parent, Node, mergeNames, unmergeNames } from 'paths-tree-unist';
import { LitWrapper } from './lit-wrapper';
import { html, TemplateResult } from 'lit-html';
import { css } from 'lit-css'
import { IFile, EFileState } from '../interfaces';
import { createEllipsis } from '../helpers/create-ellipsis';

const SORT = ( a: Parent<any>, b: Parent<any> ) =>
{
	// Folders before files

	const isFolder = x => !! x.children

	if ( ! isFolder( a ) && isFolder( b ) ) return 1;
	if ( isFolder( a ) && ! isFolder( b ) ) return -1;

	// They have same type, compare chunks
	
	for ( let i = 0; i < a.data.chunks.length; i++ )
	{
		const aChunk = a.data.chunks[ i ];
		const bChunk = b.data.chunks[ i ];

		if ( ! aChunk ) return -1;
		if ( ! bChunk ) return 1;

		const compare = aChunk.name.localeCompare( bChunk.name );

		if ( compare !== 0 ) return compare;
	}

	return 0;
}

const PADDING_LEVEL = 10;

export class GtwFileBrowser extends LitWrapper
{
	static get styles()
	{
		return css`

			.gtw-file-browser
			{
				width: 304px;
				flex-shrink: 0.3;

				position: sticky;
				top: 76px;
				max-height: calc(100vh - 76px);

				display: flex;
				flex-direction: column;

				margin-right: 16px;
				
				transition: flex 0.15s ease-in;
			}

			.gtw-left
			{
				/*
					Left side consists of:
					* files
					* menu
				*/

				max-height: calc(100vh - 76px);

				display: flex;
				flex-direction: column;

				/* margin-top: 16px; - needed for GitHub.com, but not GitHub Enterprise */
				
				transition: flex 0.15s ease-in;
			}

			.gtw-header
			{
				border-top: 1px solid #e1e4e8;
				padding: 5px 0;
				font-size: 13px;
				background: #fafbfc;
				font-weight: 500;
				padding: 5px 0 7px 0;
			}

			.gtw-tree-scroll
			{
				flex: 1;
				padding-top: 8px;
				padding-bottom: 8px;
				border-top: 1px solid #e1e4e8;
				border-bottom: 1px solid #e1e4e8;
				overflow-y: auto;
				overflow-x: auto;
				
				transition: opacity 0.15s ease-in;
			}

			.gtw-footer
			{
				padding: 10px 0;
				text-align: center;
				font-size: 12px;
			}


			/* FILE */

			.gtw-file
			{
				display: flex;
				align-items: center;
				padding: 2px 0;
				cursor: pointer;
				user-select: none;

				text-decoration: none;
				color: #000
			}

			.gtw-file:hover
			{
				background: #f6f6f6;
				text-decoration: none;
			}
				
			.gtw-file .gtw-file-name
			{
				white-space: nowrap; 
				overflow: hidden;
				flex: 1;

				font-size: 13px;
			}

			.gtw-file .gtw-stats
			{
				flex: 0 0 auto;

				font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
				font-size: 12px;
				margin: 0 8px;
			}

			.gtw-file .gtw-stats .gtw-stats__additions
			{
				color: #28a745;
			}

			.gtw-file .gtw-stats .gtw-stats__deletions
			{
				color: #cb2431;
			}

			.gtw-file .gtw-file__commented-icon
			{
				margin-right: 7px;
			}

			.gtw-file svg
			{
				margin-right: 5px;
				height: 12px;
			}

			/* Folder */

			.gtw-folder
			{
				padding-bottom: 3px;
			}

			.gtw-folder .gtw-holder
			{
				padding: 2px 0;

				display: flex;
				align-items: center;
				user-select: none;

				cursor: pointer;

				font-size: 13px;
			}

			.gtw-folder .gtw-holder svg
			{
				flex: 0 0 auto;
				width: 10px;
				height: 12px;
				margin-right: 3px;
				fill: #586069;
				position: relative;
				top: 2px;
			}

			.gtw-folder .gtw-holder:hover
			{
				background: #f6f6f6;
			}

			.gtw-folder--is-closed .gtw-content
			{
				display: none;
			}

			/* Loading */
			.gtw-loading
			{
				height: 150px;
				display: flex;
				align-items: center;
				justify-content: center;
			}


			.gtw-loading-animation
			{
				display: inline-block;
				position: relative;
				width: 80px;
				height: 80px;
			}

			.gtw-loading-animation div
			{
				position: absolute;
				border: 4px solid #ccc;
				opacity: 1;
				border-radius: 50%;
				animation: gtw-loading-animation 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
			}

			.gtw-loading-animation div:nth-child(2)
			{
				animation-delay: -0.5s;
			}

			@keyframes gtw-loading-animation
			{
				0% {
					top: 36px;
					left: 36px;
					width: 0;
					height: 0;
					opacity: 1;
				}
				100% {
					top: 0px;
					left: 0px;
					width: 72px;
					height: 72px;
					opacity: 0;
				}
			}

		`
	}


	treeManager: Manager<IFile> = undefined;
	scrapped: { path: string, data: IFile }[] = [];

	rescrap: number;


	constructor()
	{
		super();

		this.rescrap = setInterval( this.scrape.bind( this ), 1000 )
	}


	async scrape()
	{
		this.scrapped = scrape().map( x => ({ path: x.path, data: x }) )
		if ( this.scrapped.length === 0 ) { return }

		clearInterval( this.rescrap )

		this.treeManager = new Manager( { defaultOpen: true }, [ mergeNames ], [ unmergeNames ])
		await this.treeManager.setEntries( this.scrapped )

		this.render();

		// Have a little break and then make long filenames shorter
		// we want this action to take place only once
		setTimeout( () =>
		{
			document.querySelectorAll( '.gtw-file-name' ).forEach( fileElement =>
			{
				createEllipsis( fileElement as HTMLElement )
			})
		}, 500)
	}


	toggleFolder( node: Parent<IFile> )
	{
		if ( node.data.isOpen )
		{
			this.treeManager.close( node )
		}

		else
		{
			this.treeManager.open( node )
		}

		this.render();
	}


	buildNode( node: Parent<any>|Node<any>, level: number = 0 )
	{
		return node.children ? this.buildFolder( node as Parent<IFile>, level ) : this.buildFile( node as Node<IFile>, level );
	}


	buildFile( node: Node<IFile>, level: number = 0 ): TemplateResult
	{
		let icon = html``;

		// File only have one chunk
		const chunk = node.data.chunks[0]

		switch ( chunk.userData.changeType )
		{
			case EFileState.ADDED:

				icon = html`<svg title="added" style="fill: #28a745;" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true">
						<path fill-rule="evenodd" d="M13 1H1c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1zm0 13H1V2h12v12zM6 9H3V7h3V4h2v3h3v2H8v3H6V9z"></path>
					</svg>`
				break;
			
			case EFileState.UPDATED:
				icon = html`<svg title="modified" style="fill: #dbab09;" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true">
						<path fill-rule="evenodd" d="M13 1H1c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1zm0 13H1V2h12v12zM4 8c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3z"></path>
					</svg>`
				break;
			
			case EFileState.DELETED:
				icon = html`<svg title="removed" style="fill: #cb2431;" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true">
						<path fill-rule="evenodd" d="M13 1H1c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1zm0 13H1V2h12v12zm-2-5H3V7h8v2z"></path>
					</svg>`
				break
			
			case EFileState.RENAMED: 
				icon = html`<svg title="renamed" style="fill: #6a737d;" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true">
						<path fill-rule="evenodd" d="M6 9H3V7h3V4l5 4-5 4V9zm8-7v12c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h12c.55 0 1 .45 1 1zm-1 0H1v12h12V2z"></path>
					</svg>`
				break;
		}

		return html`
			<a class="gtw-file" style="padding-left: ${ level * PADDING_LEVEL }px" href="${ chunk.userData.hash }">
		
				${ icon }
			
				<span class="gtw-file-name" title="${ chunk.name }" use:createEllipsis> ${ chunk.name } </span>
			
				<span class="gtw-stats">
					<span class="gtw-stats__additions"> ${ chunk.userData.additions } </span>
					<span class="gtw-stats__deletions"> ${ chunk.userData.deletions } </span>
				</span>
			
			</a>`
	}


	buildFolder( node: Parent<IFile>, level: number = 0 ): TemplateResult
	{
		const title = node.data.chunks.map( ch => ch.name ).join( '/' );

		const closedIcon = html`
			<svg viewBox="0 0 8 16" version="1.1" aria-hidden="true">
				<path fill-rule="evenodd" d="M7.5 8l-5 5L1 11.5 4.75 8 1 4.5 2.5 3l5 5z"></path>
			</svg>`;

		const openedIcon = html`
			<svg viewBox="0 0 10 16" version="1.1" aria-hidden="true">
				<path fill-rule="evenodd" d="M5 11L0 6l1.5-1.5L5 8.25 8.5 4.5 10 6l-5 5z"></path>
			</svg>`;

		const icon = node.data.isOpen ? openedIcon : closedIcon

		return html`
			<div class="gtw-folder ${ node.data.isOpen ? 'gtw-folder--is-open' : 'gtw-folder--is-closed' }"> <!-- folder.isExpanded ? '' : CSS_PREFIX + '__folder--is-collapsed' -->
			
				<div class="gtw-holder" style="padding-left: ${ level * PADDING_LEVEL }px" title="${ title }" @click=${ () => this.toggleFolder( node ) }>
			
					${ icon }
			
					<span class="gtw-folder-name" use:createEllipsis> ${ title } </span>
			
				</div>
			
				<div class="gtw-content">
			
					${ node.children.slice().sort( SORT ).map( ch => this.buildNode( ch, level + 1 ) ) }
					
				</div>
				
			</div>
			`
	}


	render()
	{
		const title = this.treeManager && this.treeManager.getTree() && this.treeManager.getTree().data.chunks.map( x => x.name ).join( '/' )
		const header = title ? html`<div class="gtw-header"> ${ title } </div>` : html``;

		const loadingScreen = html`
			<div class="gtw-loading">
				<div class="gtw-loading-animation"> <div></div><div></div> </div>
			</div>
		`;

		return html`
			<div class="gtw-left">

				${ header }
			
				<!-- Scroll area (file list) -->
				<div class="gtw-tree-scroll">
			
					${ this.treeManager && this.treeManager.getTree() ? this.treeManager.getTree().children.slice().sort( SORT ).map( ch => this.buildNode( ch )) : loadingScreen }
			
				</div>
				<!-- End of scroll area -->
			
			
				<!-- Footer -->
				<div class="gtw-footer">
			
					<div> ${ this.scrapped.length } ${ this.scrapped.length === 1 ? 'file' : 'files' } changed </div>
					<!--
					<div>
						<span class="gtw-additions"> X additions </span>
						<span class="gtw-deletions"> Y deletions </span>
					</div>
					-->
					<div> Enhanced with ❤️ by GitHub Tree View extension </div>
			
				</div>
				<!-- End of footer -->
			</div>
		`
	}
}