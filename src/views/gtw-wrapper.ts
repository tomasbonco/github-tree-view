import { LitWrapper } from './lit-wrapper';
import { css} from 'lit-css'

export class GtwWrapper extends LitWrapper
{
	static get styles()
	{
		return css`
			.gtw-wrapper
			{
				display: flex;
				align-items: stretch;
			}

			
			.gtw-wrapper #files
			{
				overflow: hidden;
			}

			.gtw-wrapper #files .file:first-child .file-header
			{
				top: 0 !important;
			}
		`
	}
}