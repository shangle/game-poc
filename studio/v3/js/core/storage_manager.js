/**
 * RETRO ENGINE STUDIO 3.0 - STORAGE & 1-CLICK SHARE MANAGER
 */
import { StudioCartridge } from './cartridge.js';

export class StudioStorageManager {

	constructor( cartridge ) {

		this.cartridge = cartridge;
		this.autoSaveKey = 'retroStudio3_draft';

	}

	startAutoSave( intervalMs = 5000 ) {

		setInterval( () => {

			this.saveToLocalStorage();

		}, intervalMs );

	}

	saveToLocalStorage() {

		try {

			const json = JSON.stringify( this.cartridge.toJSON() );
			localStorage.setItem( this.autoSaveKey, json );

		} catch ( e ) {

			console.warn( 'LocalStorage save failed:', e );

		}

	}

	loadFromLocalStorage() {

		try {

			const jsonStr = localStorage.getItem( this.autoSaveKey );
			if ( jsonStr ) {

				return new StudioCartridge( JSON.parse( jsonStr ) );

			}

		} catch ( e ) {

			console.error( 'LocalStorage load failed:', e );

		}
		return null;

	}

	generateShareUrl() {

		const base64 = this.cartridge.toBase64();
		const origin = window.location.origin + window.location.pathname;
		return `${origin}?pack=${base64}`;

	}

	downloadCartridgeJson( filename = 'my_retro_game.cartridge.json' ) {

		const jsonStr = JSON.stringify( this.cartridge.toJSON(), null, 2 );
		const blob = new Blob( [ jsonStr ], { type: 'application/json' } );
		const url = URL.createObjectURL( blob );

		const a = document.createElement( 'a' );
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL( url );

	}

	importCartridgeJson( file, callback ) {

		const reader = new FileReader();
		reader.onload = ( e ) => {

			try {

				const parsed = JSON.parse( e.target.result );
				const cartridge = new StudioCartridge( parsed );
				if ( callback ) callback( cartridge );

			} catch ( err ) {

				console.error( 'Invalid JSON file:', err );
				alert( 'Failed to parse cartridge JSON file.' );

			}

		};
		reader.readAsText( file );

	}

}
