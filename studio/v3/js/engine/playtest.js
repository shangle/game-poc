/**
 * RETRO ENGINE STUDIO 3.0 - IN-EDITOR PLAYTEST ENGINE
 */
import * as THREE from 'three';
import { GRID_SIZE, ID_EMPTY, ID_PLAYER_SPAWN, ID_EXIT_GOAL } from '../core/cartridge.js';

const TILE_SIZE = 4.0;

export class StudioPlaytestEngine {

	constructor( container, cartridge, assetManager ) {

		this.container = container;
		this.cartridge = cartridge;
		this.assetManager = assetManager;

		this.active = false;
		this.scene = null;
		this.camera = null;
		this.renderer = null;

		this.player = {
			pos: new THREE.Vector3(),
			rot: new THREE.Euler( 0, 0, 0, 'YXZ' ),
			speed: 6.0,
			hp: 100,
			score: 0
		};

		this.keys = {};
		this.colliders = [];

	}

	start( levelIndex = 0 ) {

		this.active = true;
		this.initScene( levelIndex );
		this.initListeners();
		this.loop();

	}

	stop() {

		this.active = false;
		if ( document.pointerLockElement ) document.exitPointerLock();

	}

	initScene( levelIndex ) {

		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color( 0x020617 );
		this.scene.fog = new THREE.FogExp2( 0x020617, 0.02 );

		const w = this.container.clientWidth || 800;
		const h = this.container.clientHeight || 600;

		this.camera = new THREE.PerspectiveCamera( 75, w / h, 0.1, 500 );

		this.renderer = new THREE.WebGLRenderer( { antialias: false } );
		this.renderer.setSize( w, h );
		this.container.appendChild( this.renderer.domElement );

		const ambient = new THREE.AmbientLight( 0xffffff, 0.8 );
		this.scene.add( ambient );

		this.buildLevelWorld( levelIndex );

	}

	buildLevelWorld( index ) {

		const level = this.cartridge.levels[ index ] || this.cartridge.levels[ 0 ];
		const boxGeo = new THREE.BoxGeometry( TILE_SIZE, 4.0, TILE_SIZE );
		const planeGeo = new THREE.PlaneGeometry( TILE_SIZE, TILE_SIZE );
		this.colliders = [];

		let spawnFound = false;

		for ( let z = 0; z < GRID_SIZE; z ++ ) {

			for ( let x = 0; x < GRID_SIZE; x ++ ) {

				const posX = x * TILE_SIZE + TILE_SIZE / 2;
				const posZ = z * TILE_SIZE + TILE_SIZE / 2;

				// Floor
				const floorMesh = new THREE.Mesh( planeGeo, new THREE.MeshStandardMaterial( { color: 0x334155 } ) );
				floorMesh.rotation.x = - Math.PI / 2;
				floorMesh.position.set( posX, 0, posZ );
				this.scene.add( floorMesh );

				// Ceiling
				const ceilMesh = new THREE.Mesh( planeGeo, new THREE.MeshStandardMaterial( { color: 0x0f172a } ) );
				ceilMesh.rotation.x = Math.PI / 2;
				ceilMesh.position.set( posX, 4.0, posZ );
				this.scene.add( ceilMesh );

				const entId = level.map.entities[ z ][ x ];
				if ( entId === ID_PLAYER_SPAWN ) {

					this.player.pos.set( posX, 1.6, posZ );
					spawnFound = true;

				} else if ( entId !== ID_EMPTY ) {

					const wallMesh = new THREE.Mesh( boxGeo, new THREE.MeshStandardMaterial( { color: 0xf59e0b } ) );
					wallMesh.position.set( posX, 2.0, posZ );
					this.scene.add( wallMesh );

					// Wall Box Collider
					this.colliders.push( new THREE.Box3().setFromObject( wallMesh ) );

				}

			}

		}

		if ( ! spawnFound ) this.player.pos.set( TILE_SIZE * 2, 1.6, TILE_SIZE * 2 );
		this.camera.position.copy( this.player.pos );

	}

	initListeners() {

		this.container.requestPointerLock();

		document.addEventListener( 'keydown', ( e ) => this.keys[ e.key.toLowerCase() ] = true );
		document.addEventListener( 'keyup', ( e ) => this.keys[ e.key.toLowerCase() ] = false );

		document.addEventListener( 'mousemove', ( e ) => {

			if ( this.active && document.pointerLockElement ) {

				this.player.rot.y -= e.movementX * 0.002;
				this.player.rot.x -= e.movementY * 0.002;
				this.player.rot.x = Math.max( - Math.PI / 2, Math.min( Math.PI / 2, this.player.rot.x ) );
				this.camera.quaternion.setFromEuler( this.player.rot );

			}

		} );

	}

	loop() {

		if ( ! this.active ) return;
		requestAnimationFrame( () => this.loop() );

		// WASD Movement
		const moveVec = new THREE.Vector3();
		if ( this.keys[ 'w' ] ) moveVec.z -= 1;
		if ( this.keys[ 's' ] ) moveVec.z += 1;
		if ( this.keys[ 'a' ] ) moveVec.x -= 1;
		if ( this.keys[ 'd' ] ) moveVec.x += 1;

		if ( moveVec.lengthSq() > 0 ) {

			moveVec.normalize();
			moveVec.applyEuler( new THREE.Euler( 0, this.player.rot.y, 0 ) );

			const deltaPos = moveVec.clone().multiplyScalar( 0.15 );
			const nextPos = this.player.pos.clone().add( deltaPos );

			// Basic Box Collision Check
			let collision = false;
			const pBox = new THREE.Box3().setFromCenterAndSize( nextPos, new THREE.Vector3( 1.0, 1.8, 1.0 ) );
			for ( const col of this.colliders ) {

				if ( pBox.intersectsBox( col ) ) {

					collision = true;
					break;

				}

			}

			if ( ! collision ) {

				this.player.pos.copy( nextPos );

			}

		}

		this.camera.position.copy( this.player.pos );
		this.renderer.render( this.scene, this.camera );

	}

}
