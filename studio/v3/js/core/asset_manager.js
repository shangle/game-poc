/**
 * RETRO ENGINE STUDIO 3.0 - ROBUST ASSET MANAGER & PIXEL ART EDITOR
 */
import * as THREE from 'three';

export class StudioAssetManager {

	constructor( cartridge ) {

		this.cartridge = cartridge;
		this.textureCache = {};
		this.threeTextureCache = {};

	}

	// 1. Asset Creation Functions
	createCustomWall( name, color = '#38bdf8', roughness = 0.7, metalness = 0.1 ) {

		const newId = this.getNextId( 'walls', 1 );
		const wall = {
			id: newId,
			name: name,
			tex: `custom_wall_${newId}`,
			color: color,
			roughness: roughness,
			metalness: metalness
		};
		this.cartridge.globalPalette.walls.push( wall );
		return wall;

	}

	createCustomFloor( name, color = '#64748b', roughness = 0.6 ) {

		const newId = this.getNextId( 'floors', 101 );
		const floor = {
			id: newId,
			name: name,
			tex: `custom_floor_${newId}`,
			color: color,
			roughness: roughness,
			metalness: 0.0
		};
		this.cartridge.globalPalette.floors.push( floor );
		return floor;

	}

	createCustomEnemy( name, color = '#ef4444', hp = 50, speed = 2.0, damage = 15 ) {

		const newId = this.getNextId( 'enemies', 10 );
		const enemy = {
			id: newId,
			name: name,
			tex: `custom_enemy_${newId}`,
			color: color,
			hp: hp,
			speed: speed,
			damage: damage
		};
		this.cartridge.globalPalette.enemies.push( enemy );
		return enemy;

	}

	createCustomItem( name, color = '#f59e0b', type = 'hp', value = 25 ) {

		const newId = this.getNextId( 'items', 30 );
		const item = {
			id: newId,
			name: name,
			tex: `custom_item_${newId}`,
			color: color,
			type: type,
			value: value
		};
		this.cartridge.globalPalette.items.push( item );
		return item;

	}

	getNextId( category, startId ) {

		const items = this.cartridge.globalPalette[ category ] || [];
		if ( items.length === 0 ) return startId;
		const maxId = Math.max( ...items.map( i => i.id ) );
		return Math.max( maxId + 1, startId );

	}

	// 2. Pixel Art Editor Storage & Binding
	savePixelArtTexture( texKey, dataUrl ) {

		this.cartridge.textures[ texKey ] = dataUrl;
		delete this.threeTextureCache[ texKey ]; // Invalidate Three.js cache

	}

	getTexture( texKey, fallbackColor = '#64748b' ) {

		if ( this.threeTextureCache[ texKey ] ) {

			return this.threeTextureCache[ texKey ];

		}

		let texture;
		if ( this.cartridge.textures[ texKey ] ) {

			const img = new Image();
			img.src = this.cartridge.textures[ texKey ];
			texture = new THREE.Texture( img );
			img.onload = () => {

				texture.needsUpdate = true;

			};

		} else {

			// Generate procedural canvas texture fallback
			texture = this.generateProceduralTexture( texKey, fallbackColor );

		}

		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.magFilter = THREE.NearestFilter; // Crisp retro pixel art filter
		texture.minFilter = THREE.NearestFilter;

		this.threeTextureCache[ texKey ] = texture;
		return texture;

	}

	generateProceduralTexture( type, baseColorHex ) {

		const canvas = document.createElement( 'canvas' );
		canvas.width = 64;
		canvas.height = 64;
		const ctx = canvas.getContext( '2d' );

		ctx.fillStyle = baseColorHex;
		ctx.fillRect( 0, 0, 64, 64 );

		// Texture detailing patterns
		if ( type.includes( 'wall' ) ) {

			ctx.strokeStyle = 'rgba(0,0,0,0.3)';
			ctx.lineWidth = 4;
			ctx.strokeRect( 2, 2, 60, 60 );
			ctx.beginPath();
			ctx.moveTo( 0, 32 );
			ctx.lineTo( 64, 32 );
			ctx.stroke();

		} else if ( type.includes( 'floor' ) ) {

			ctx.fillStyle = 'rgba(255,255,255,0.15)';
			for ( let i = 0; i < 200; i ++ ) {

				ctx.fillRect( Math.random() * 64, Math.random() * 64, 2, 2 );

			}

		}

		const texture = new THREE.CanvasTexture( canvas );
		return texture;

	}

}
