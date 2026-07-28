/**
 * RETRO ENGINE STUDIO 3.0 - REAL-TIME 3D WEBGL VIEWPORT ENGINE
 */
import * as THREE from 'three';
import { GRID_SIZE, ID_EMPTY, ID_PLAYER_SPAWN, ID_EXIT_GOAL } from '../core/cartridge.js';

const TILE_SIZE = 4.0;
const WALL_HEIGHT = 4.0;

export class StudioView3D {

	constructor( container, cartridge, assetManager ) {

		this.container = container;
		this.cartridge = cartridge;
		this.assetManager = assetManager;

		this.scene = null;
		this.camera = null;
		this.renderer = null;
		this.worldGroup = null;

		this.init();
		this.buildLevel( 0 );

		// Listen for grid editor edits to update 3D scene in real-time!
		document.addEventListener( 'cartridge-updated', ( e ) => {

			this.buildLevel( e.detail.levelIndex );

		} );

	}

	init() {

		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color( 0x020617 );
		this.scene.fog = new THREE.FogExp2( 0x020617, 0.015 );

		const width = this.container.clientWidth || 600;
		const height = this.container.clientHeight || 600;

		this.camera = new THREE.PerspectiveCamera( 60, width / height, 0.1, 500 );
		this.camera.position.set( GRID_SIZE * TILE_SIZE * 0.5, 30, GRID_SIZE * TILE_SIZE * 1.1 );
		this.camera.lookAt( GRID_SIZE * TILE_SIZE * 0.5, 0, GRID_SIZE * TILE_SIZE * 0.5 );

		this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		this.renderer.setSize( width, height );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.shadowMap.enabled = true;
		this.container.appendChild( this.renderer.domElement );

		// Lighting
		const ambientLight = new THREE.AmbientLight( 0xffffff, 0.6 );
		this.scene.add( ambientLight );

		const sun = new THREE.DirectionalLight( 0xffffff, 1.2 );
		sun.position.set( 30, 50, 40 );
		sun.castShadow = true;
		this.scene.add( sun );

		this.worldGroup = new THREE.Group();
		this.scene.add( this.worldGroup );

		window.addEventListener( 'resize', () => this.onResize() );
		this.animate();

	}

	onResize() {

		if ( ! this.container || ! this.renderer ) return;
		const width = this.container.clientWidth;
		const height = this.container.clientHeight;
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( width, height );

	}

	buildLevel( index = 0 ) {

		if ( ! this.worldGroup ) return;
		while ( this.worldGroup.children.length > 0 ) {

			const obj = this.worldGroup.children[ 0 ];
			this.worldGroup.remove( obj );

		}

		const level = this.cartridge.levels[ index ] || this.cartridge.levels[ 0 ];
		const boxGeo = new THREE.BoxGeometry( TILE_SIZE, WALL_HEIGHT, TILE_SIZE );
		const planeGeo = new THREE.PlaneGeometry( TILE_SIZE, TILE_SIZE );

		for ( let z = 0; z < GRID_SIZE; z ++ ) {

			for ( let x = 0; x < GRID_SIZE; x ++ ) {

				const posX = x * TILE_SIZE + TILE_SIZE / 2;
				const posZ = z * TILE_SIZE + TILE_SIZE / 2;

				// Floor Tile
				const floorId = level.map.floors[ z ][ x ];
				const floorMat = this.createMaterial( 'floors', floorId, '#334155' );
				const floorMesh = new THREE.Mesh( planeGeo, floorMat );
				floorMesh.rotation.x = - Math.PI / 2;
				floorMesh.position.set( posX, 0, posZ );
				this.worldGroup.add( floorMesh );

				// Ceiling Tile
				const ceilId = level.map.ceils[ z ][ x ];
				const ceilMat = this.createMaterial( 'ceils', ceilId, '#0f172a' );
				const ceilMesh = new THREE.Mesh( planeGeo, ceilMat );
				ceilMesh.rotation.x = Math.PI / 2;
				ceilMesh.position.set( posX, WALL_HEIGHT, posZ );
				this.worldGroup.add( ceilMesh );

				// Entity / Wall / Item / Enemy
				const entId = level.map.entities[ z ][ x ];
				if ( entId !== ID_EMPTY ) {

					if ( entId === ID_PLAYER_SPAWN ) {

						// Player Marker
						const playerGeo = new THREE.CapsuleGeometry( 0.6, 1.2, 8, 16 );
						const playerMat = new THREE.MeshStandardMaterial( { color: 0x38bdf8, roughness: 0.3 } );
						const playerMesh = new THREE.Mesh( playerGeo, playerMat );
						playerMesh.position.set( posX, 1.2, posZ );
						this.worldGroup.add( playerMesh );

					} else if ( entId === ID_EXIT_GOAL ) {

						// Exit Portal Goal Marker
						const goalGeo = new THREE.CylinderGeometry( 0.8, 0.8, 3.0, 16 );
						const goalMat = new THREE.MeshStandardMaterial( { color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 0.5 } );
						const goalMesh = new THREE.Mesh( goalGeo, goalMat );
						goalMesh.position.set( posX, 1.5, posZ );
						this.worldGroup.add( goalMesh );

					} else {

						// Wall or Prop
						const wallMat = this.createMaterial( 'walls', entId, '#f59e0b' );
						const wallMesh = new THREE.Mesh( boxGeo, wallMat );
						wallMesh.position.set( posX, WALL_HEIGHT / 2, posZ );
						wallMesh.castShadow = true;
						wallMesh.receiveShadow = true;
						this.worldGroup.add( wallMesh );

					}

				}

			}

		}

	}

	createMaterial( category, id, fallbackHex ) {

		const list = this.cartridge.globalPalette[ category ] || [];
		const item = list.find( i => i.id === id );
		const color = ( item && item.color ) ? item.color : fallbackHex;
		const texKey = ( item && item.tex ) ? item.tex : `fallback_${id}`;

		const texture = this.assetManager.getTexture( texKey, color );
		return new THREE.MeshStandardMaterial( {
			map: texture,
			color: color,
			roughness: ( item && item.roughness !== undefined ) ? item.roughness : 0.7,
			metalness: ( item && item.metalness !== undefined ) ? item.metalness : 0.1
		} );

	}

	animate() {

		requestAnimationFrame( () => this.animate() );
		if ( this.worldGroup ) {

			this.worldGroup.rotation.y += 0.002; // Slow aesthetic turntable rotation in preview mode

		}
		if ( this.renderer && this.scene && this.camera ) {

			this.renderer.render( this.scene, this.camera );

		}

	}

}
