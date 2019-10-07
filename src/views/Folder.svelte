<script lang="ts">

import { IFolder } from '../interfaces.ts'
import File from './File.svelte'
import { createEllipsis } from '../helpers/create-ellipsis.ts'

export let folder: IFolder;
export let level: number = 0;

</script>

<style lang="stylus">

.gh-folder
{
	padding-bottom: 6px;
}

.gh-holder
{
	padding: 2px 0;
	border-radius: 3px;

	display: flex;
	align-items: center;

	// cursor: pointer;
	font-size: 13px;

	svg
	{
		flex: 0 0 auto;
		width: 14px;
		height: 14px;
		margin-right: 6px;
		fill: #586069;
	}

	/*
	&:hover
	{
		background: #f2f2f2;
	}
	*/
}

.gh-folder-name
{
	white-space: nowrap; 
	overflow: hidden;
	flex: 1;

	font-size: 13px;
	font-weight: bold;
}

</style>

<div class="gh-folder"> <!-- ${folder.isExpanded ? '' : CSS_PREFIX + '__folder--is-collapsed'} -->
			
	<div class="gh-holder" style="padding-left: { level * 14 }px" title="{folder.name}">

		{#if folder.isExpanded}

		<!-- Opened folder -->
		<svg viewBox="0 0 10 16" version="1.1" aria-hidden="true">
			<path fill-rule="evenodd" d="M5 11L0 6l1.5-1.5L5 8.25 8.5 4.5 10 6l-5 5z"></path>
		</svg>
		
		{:else}

		<!-- Closed folder -->
		<svg viewBox="0 0 8 16" version="1.1" aria-hidden="true">
			<path fill-rule="evenodd" d="M7.5 8l-5 5L1 11.5 4.75 8 1 4.5 2.5 3l5 5z"></path>
		</svg>

		{/if}

		<span class="gh-folder-name" use:createEllipsis> { folder.name } </span>

	</div>

	<div class="gh-content">

		{#each folder.subfolders as subfolder }

			<svelte:self folder="{subfolder}" level="{level + 1}" />

		{/each}
		
		{#each folder.files as file}

			<File {file} level="{level + 1}"></File>

		{/each}
		
	</div>
	
</div>