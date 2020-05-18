// You cannot use Web Elements (lit-element) because it would be too easy.
// https://bugs.chromium.org/p/chromium/issues/detail?id=390807
// Engineers at Google hate easy. (They made lit, so maybe that's an exception.)
// Engineers at Google LOVE workarounds.

import {html, render} from 'lit-html';
import {css} from 'lit-css'

export class LitWrapper
{
	static get styles()
	{
		return css``
	}

	params: object;
	
	updateParams( params: object )
	{
		this.params = { ...this.params, params };
		this.render();
	}

	render()
	{
		return html``;
	}
}


export function attachToElement( element: HTMLElement, controller, params: object = {} )
{
	const styles = html`<style> ${ controller.styles } </style>`

	const instance = new controller( element );
	const _render = instance.render;

	instance.render = (function()
	{
		render( [styles, _render.bind( instance )()], element  )
	}).bind( instance )
	
	function update( params )
	{
		instance.updateParams( params );
	}

	update( params );

	return update;
}