<script lang="ts">

import { EFileState, IFile } from '../interfaces.ts';
import { createEllipsis } from '../helpers/create-ellipsis.ts'

export let file: IFile;
export let level: number = 0;



function setActive()
{
	document.location.hash = file.hash
}

</script>

<style lang="stylus">

.gh-file
{
	display: flex;
	align-items: center;
	padding: 2px 0;
	cursor: pointer;
	
	.gh-file-name
	{
		white-space: nowrap; 
		overflow: hidden;
		flex: 1;

		font-size: 13px;
	}

	.gh-stats
	{
		flex: 0 0 auto;

		font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
		font-size: 12px;
		margin: 0 8px;

		&__additions
		{
			color: #28a745;
		}

		&__deletions
		{
			color: #cb2431;
		}
	}

	&__commented-icon
	{
		margin-right: 7px;
	}

	svg
	{
		margin-right: 5px;
		height: 14px;
	}
}

</style>


<div class="gh-file" style="padding-left: { level * 14 }px" on:click={setActive}>
	
	<!-- Addition -->
	{#if file.changeType === EFileState.ADDED }
	<svg title="added" style="fill: #28a745;" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true">
		<path fill-rule="evenodd" d="M13 1H1c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1zm0 13H1V2h12v12zM6 9H3V7h3V4h2v3h3v2H8v3H6V9z"></path>
	</svg>
	{/if}

	<!-- Modified -->
	{#if file.changeType === EFileState.UPDATED }
	<svg title="modified" style="fill: #dbab09;" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true">
		<path fill-rule="evenodd" d="M13 1H1c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1zm0 13H1V2h12v12zM4 8c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3z"></path>
	</svg>
	{/if}

	<!-- Deletion -->
	{#if file.changeType === EFileState.DELETED }
	<svg title="removed" style="fill: #cb2431;" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true">
		<path fill-rule="evenodd" d="M13 1H1c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1zm0 13H1V2h12v12zm-2-5H3V7h8v2z"></path>
	</svg>
	{/if}

	<!-- Rename -->
	{#if file.changeType === EFileState.RENAMED }
	<svg title="renamed" style="fill: #6a737d;" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true">
		<path fill-rule="evenodd" d="M6 9H3V7h3V4l5 4-5 4V9zm8-7v12c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h12c.55 0 1 .45 1 1zm-1 0H1v12h12V2z"></path>
	</svg>
	{/if}

	<span class="gh-file-name" title="{ file.base }.{ file.ext }" use:createEllipsis> { file.base }.{ file.ext } </span>

	<span class="gh-stats">
		<span class="gh-stats__additions"> { file.additions } </span>
		<span class="gh-stats__deletions"> { file.deletions } </span>
	</span>

</div>