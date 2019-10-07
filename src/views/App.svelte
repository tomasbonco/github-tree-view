<script lang="ts">

	import File from './File.svelte'
	import Folder from './Folder.svelte'
	import { files as filesStore, treeStructure } from '../store.ts'
	import { IFile } from '../interfaces.ts'
	import { onMount } from 'svelte'

	export let files: IFile[];

	let filesCount: number;
	$: filesCount = $filesStore.length

	filesStore.set( files );
	
</script>

<style lang="stylus">

	.gh-left
	{
		/*
			Left side consists of:
			* files
			* menu
		*/

   		max-height: calc(100vh - 76px);

		display: flex;
		flex-direction: column;

		// margin-top: 16px; - needed for GitHub.com, but not GitHub Enterprise
		
		transition: flex 0.15s ease-in;
	}

	.gh-header
	{
		border-top: 1px solid #e1e4e8;
		padding: 5px 0;
		font-size: 13px;
		background: #fafbfc;
		font-weight: 500;
		padding: 5px 0 7px 0;
	}

	.gh-tree-scroll
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

	.gh-footer
	{
		padding: 10px 0;
		text-align: center;
		font-size: 12px;
	}

</style>

<div class="gh-left">

	{#if $treeStructure.name }
	<div class="gh-header">
		{$treeStructure.name}
	</div>
	{/if}


	<!-- Scroll area (file list) -->
	<div class="gh-tree-scroll">

		{#each $treeStructure.subfolders as subfolder }
		<Folder folder={subfolder} level={0}></Folder>
		{/each}

		{#each $treeStructure.files as file }
		<File {file} level={0}></File>
		{/each}		

	</div>
	<!-- End of scroll area -->


	<!-- Footer -->
	<div class="gh-footer">

		<div> { filesCount } { filesCount === 1 ? 'file' : `files` } changed </div>
		<!--
		<div>
			<span class="gh-additions"> X additions </span>
			<span class="gh-deletions"> Y deletions </span>
		</div>
		-->
		<div> Enhanced with ❤️ by GitHub Tree View extension </div>

	</div>
	<!-- End of footer -->
	
</div>
