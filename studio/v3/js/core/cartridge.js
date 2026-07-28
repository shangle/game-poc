/**
 * RETRO ENGINE STUDIO 3.0 - CORE CARTRIDGE SPECIFICATION
 * Fully serializable, modular level pack format.
 */

export const GRID_SIZE = 16;
export const ID_EMPTY = 0;
export const ID_WALL_DEFAULT = 1;
export const ID_FLOOR_DEFAULT = 101;
export const ID_CEIL_DEFAULT = 201;
export const ID_PLAYER_SPAWN = 99;
export const ID_EXIT_GOAL = 98;

export class StudioCartridge {

	constructor( data = null ) {

		if ( data ) {

			this.fromJSON( data );

		} else {

			this.initDefault();

		}

	}

	initDefault() {

		this.metadata = {
			title: 'NEW RETRO GAME',
			version: '3.0.0',
			author: 'Studio Creator',
			description: 'Created with Retro Engine Studio 3.0'
		};

		this.textures = {}; // Custom Base64 PNGs or pixel matrices

		this.globalPalette = {
			walls: [
				{ id: 1, name: 'Stone Wall', tex: 'wall_stone', color: '#475569', roughness: 0.8, metalness: 0.1 },
				{ id: 2, name: 'Brick Wall', tex: 'wall_brick', color: '#991b1b', roughness: 0.9, metalness: 0.0 },
				{ id: 3, name: 'Wood Siding', tex: 'wall_wood', color: '#b45309', roughness: 0.6, metalness: 0.0 }
			],
			floors: [
				{ id: 101, name: 'Stone Tile', tex: 'floor_stone', color: '#334155', roughness: 0.7, metalness: 0.1 },
				{ id: 102, name: 'Wood Planks', tex: 'floor_wood', color: '#78350f', roughness: 0.5, metalness: 0.0 }
			],
			ceils: [
				{ id: 201, name: 'Dark Ceiling', tex: 'ceil_dark', color: '#0f172a', roughness: 0.9, metalness: 0.0 }
			],
			enemies: [
				{ id: 10, name: 'Green Slime', tex: 'enemy_slime', color: '#22c55e', hp: 40, speed: 1.5, damage: 10 },
				{ id: 11, name: 'Guard', tex: 'enemy_guard', color: '#ef4444', hp: 80, speed: 2.2, damage: 20 }
			],
			items: [
				{ id: 30, name: 'Health Pack', tex: 'item_hp', color: '#38bdf8', type: 'hp', value: 25 },
				{ id: 31, name: 'Ammo Box', tex: 'item_ammo', color: '#f59e0b', type: 'ammo', value: 20 },
				{ id: 32, name: 'Gold Coin', tex: 'item_coin', color: '#eab308', type: 'score', value: 100 }
			]
		};

		this.levels = [
			this.createDefaultLevel( 'lvl_1', 'Stage 1: The Beginning' )
		];

	}

	createDefaultLevel( id, name ) {

		const floors = Array( GRID_SIZE ).fill().map( () => Array( GRID_SIZE ).fill( ID_FLOOR_DEFAULT ) );
		const ceils = Array( GRID_SIZE ).fill().map( () => Array( GRID_SIZE ).fill( ID_CEIL_DEFAULT ) );
		const entities = Array( GRID_SIZE ).fill().map( ( _, z ) =>
			Array( GRID_SIZE ).fill( 0 ).map( ( _, x ) => {

				if ( z === 0 || z === GRID_SIZE - 1 || x === 0 || x === GRID_SIZE - 1 ) return ID_WALL_DEFAULT;
				if ( z === 2 && x === 2 ) return ID_PLAYER_SPAWN;
				if ( z === GRID_SIZE - 3 && x === GRID_SIZE - 3 ) return ID_EXIT_GOAL;
				if ( z === 5 && x === 5 ) return 30; // Health pack
				if ( z === 8 && x === 8 ) return 10; // Slime
				return ID_EMPTY;

			} )
		);

		return {
			id: id,
			name: name,
			gridSize: GRID_SIZE,
			map: {
				floors: floors,
				ceils: ceils,
				entities: entities
			},
			exits: [ { targetLevel: 'lvl_2' } ]
		};

	}

	addLevel( name = 'New Stage' ) {

		const id = 'lvl_' + ( this.levels.length + 1 );
		const newLevel = this.createDefaultLevel( id, name );
		this.levels.push( newLevel );
		return newLevel;

	}

	deleteLevel( index ) {

		if ( this.levels.length <= 1 ) return false;
		this.levels.splice( index, 1 );
		return true;

	}

	toJSON() {

		return {
			metadata: this.metadata,
			textures: this.textures,
			globalPalette: this.globalPalette,
			levels: this.levels
		};

	}

	fromJSON( json ) {

		try {

			const parsed = ( typeof json === 'string' ) ? JSON.parse( json ) : json;
			this.metadata = parsed.metadata || this.metadata;
			this.textures = parsed.textures || {};
			this.globalPalette = parsed.globalPalette || this.globalPalette;
			this.levels = parsed.levels || [ this.createDefaultLevel( 'lvl_1', 'Stage 1' ) ];

		} catch ( e ) {

			console.error( 'Failed to parse Cartridge JSON:', e );
			this.initDefault();

		}

	}

	toBase64() {

		return btoa( encodeURIComponent( JSON.stringify( this.toJSON() ) ) );

	}

	static fromBase64( base64Str ) {

		try {

			const jsonStr = decodeURIComponent( atob( base64Str ) );
			return new StudioCartridge( JSON.parse( jsonStr ) );

		} catch ( e ) {

			console.error( 'Failed to decode Base64 Cartridge:', e );
			return new StudioCartridge();

		}

	}

}
