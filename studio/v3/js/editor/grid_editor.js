/**
 * RETRO ENGINE STUDIO 3.0 - INTERACTIVE 2D GRID EDITOR & TOOL SUITE
 */
import { GRID_SIZE, ID_EMPTY, ID_PLAYER_SPAWN, ID_EXIT_GOAL } from '../core/cartridge.js';

export class StudioGridEditor {

	constructor( canvas, cartridge, assetManager ) {

		this.canvas = canvas;
		this.ctx = canvas.getContext( '2d' );
		this.cartridge = cartridge;
		this.assetManager = assetManager;

		this.currentLevelIndex = 0;
		this.activeLayer = 'entities'; // 'entities', 'floors', 'ceils'
		this.activeTool = 'brush'; // 'brush', 'box_fill', 'line', 'eyedropper', 'eraser'
		this.activeAssetId = 1; // Wall ID 1 default

		this.history = [];
		this.historyIndex = -1;

		// Drawing Drag State
		this.isDragging = false;
		this.dragStart = { x: 0, z: 0 };
		this.dragCurrent = { x: 0, z: 0 };

		this.initListeners();
		this.saveState();
		this.render();

	}

	getLevel() {

		return this.cartridge.levels[ this.currentLevelIndex ] || this.cartridge.levels[ 0 ];

	}

	saveState() {

		const level = this.getLevel();
		const stateStr = JSON.stringify( level.map );
		if ( this.historyIndex >= 0 && this.history[ this.historyIndex ] === stateStr ) return;

		this.history = this.history.slice( 0, this.historyIndex + 1 );
		this.history.push( stateStr );
		this.historyIndex = this.history.length - 1;

		if ( this.history.length > 30 ) {

			this.history.shift();
			this.historyIndex --;

		}

	}

	undo() {

		if ( this.historyIndex > 0 ) {

			this.historyIndex --;
			this.getLevel().map = JSON.parse( this.history[ this.historyIndex ] );
			this.notifyChange();
			this.render();

		}

	}

	redo() {

		if ( this.historyIndex < this.history.length - 1 ) {

			this.historyIndex ++;
			this.getLevel().map = JSON.parse( this.history[ this.historyIndex ] );
			this.notifyChange();
			this.render();

		}

	}

	notifyChange() {

		const event = new CustomEvent( 'cartridge-updated', { detail: { levelIndex: this.currentLevelIndex } } );
		document.dispatchEvent( event );

	}

	initListeners() {

		this.canvas.addEventListener( 'mousedown', ( e ) => this.onMouseDown( e ) );
		this.canvas.addEventListener( 'mousemove', ( e ) => this.onMouseMove( e ) );
		window.addEventListener( 'mouseup', ( e ) => this.onMouseUp( e ) );

		// Keyboard Hotkeys
		window.addEventListener( 'keydown', ( e ) => {

			if ( e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' ) return;

			const key = e.key.toLowerCase();
			if ( key === 'b' ) this.setTool( 'brush' );
			else if ( key === 'f' ) this.setTool( 'box_fill' );
			else if ( key === 'l' ) this.setTool( 'line' );
			else if ( key === 'i' ) this.setTool( 'eyedropper' );
			else if ( key === 'e' ) this.setTool( 'eraser' );
			else if ( e.ctrlKey && key === 'z' ) {

				e.preventDefault(); this.undo();

			} else if ( e.ctrlKey && key === 'y' ) {

				e.preventDefault(); this.redo();

			}

		} );

	}

	setTool( tool ) {

		this.activeTool = tool;
		const event = new CustomEvent( 'tool-changed', { detail: { tool } } );
		document.dispatchEvent( event );
		this.render();

	}

	setLayer( layer ) {

		this.activeLayer = layer;
		this.render();

	}

	setAssetId( id ) {

		this.activeAssetId = id;

	}

	getGridCell( e ) {

		const rect = this.canvas.getBoundingClientRect();
		const cellW = rect.width / GRID_SIZE;
		const cellH = rect.height / GRID_SIZE;
		const x = Math.floor( ( e.clientX - rect.left ) / cellW );
		const z = Math.floor( ( e.clientY - rect.top ) / cellH );
		return {
			x: Math.max( 0, Math.min( GRID_SIZE - 1, x ) ),
			z: Math.max( 0, Math.min( GRID_SIZE - 1, z ) )
		};

	}

	onMouseDown( e ) {

		this.isDragging = true;
		const cell = this.getGridCell( e );
		this.dragStart = cell;
		this.dragCurrent = cell;

		if ( this.activeTool === 'eyedropper' ) {

			this.pickEyedropper( cell );
			this.isDragging = false;
			return;

		}

		if ( this.activeTool === 'brush' || this.activeTool === 'eraser' ) {

			this.applyPaintCell( cell.z, cell.x );

		}

	}

	onMouseMove( e ) {

		const cell = this.getGridCell( e );
		this.dragCurrent = cell;

		if ( this.isDragging ) {

			if ( this.activeTool === 'brush' || this.activeTool === 'eraser' ) {

				this.applyPaintCell( cell.z, cell.x );

			}

		}

		this.render();

	}

	onMouseUp( e ) {

		if ( ! this.isDragging ) return;
		this.isDragging = false;

		if ( this.activeTool === 'box_fill' ) {

			this.applyBoxFill( this.dragStart, this.dragCurrent );

		} else if ( this.activeTool === 'line' ) {

			this.applyLine( this.dragStart, this.dragCurrent );

		}

		this.saveState();
		this.notifyChange();
		this.render();

	}

	applyPaintCell( z, x ) {

		const level = this.getLevel();
		const val = ( this.activeTool === 'eraser' ) ? ID_EMPTY : this.activeAssetId;

		if ( this.activeLayer === 'entities' ) {

			// Player Spawn / Exit Goal rules
			if ( val === ID_PLAYER_SPAWN ) {

				for ( let r = 0; r < GRID_SIZE; r ++ ) {

					for ( let c = 0; c < GRID_SIZE; c ++ ) {

						if ( level.map.entities[ r ][ c ] === ID_PLAYER_SPAWN ) level.map.entities[ r ][ c ] = ID_EMPTY;

					}

				}

			}
			level.map.entities[ z ][ x ] = val;

		} else if ( this.activeLayer === 'floors' ) {

			level.map.floors[ z ][ x ] = val;

		} else if ( this.activeLayer === 'ceils' ) {

			level.map.ceils[ z ][ x ] = val;

		}

		this.notifyChange();

	}

	applyBoxFill( start, end ) {

		const minX = Math.min( start.x, end.x );
		const maxX = Math.max( start.x, end.x );
		const minZ = Math.min( start.z, end.z );
		const maxZ = Math.max( start.z, end.z );

		for ( let z = minZ; z <= maxZ; z ++ ) {

			for ( let x = minX; x <= maxX; x ++ ) {

				this.applyPaintCell( z, x );

			}

		}

	}

	applyLine( start, end ) {

		let x0 = start.x, z0 = start.z;
		let x1 = end.x, z1 = end.z;
		const dx = Math.abs( x1 - x0 ), sx = x0 < x1 ? 1 : - 1;
		const dz = Math.abs( z1 - z0 ), sz = z0 < z1 ? 1 : - 1;
		let err = ( dx > dz ? dx : - dz ) / 2;

		while ( true ) {

			this.applyPaintCell( z0, x0 );
			if ( x0 === x1 && z0 === z1 ) break;
			const e2 = err;
			if ( e2 > - dx ) {

				err -= dz; x0 += sx;

			}
			if ( e2 < dz ) {

				err += dx; z0 += sz;

			}

		}

	}

	pickEyedropper( cell ) {

		const level = this.getLevel();
		let val = ID_EMPTY;

		if ( this.activeLayer === 'entities' ) val = level.map.entities[ cell.z ][ cell.x ];
		else if ( this.activeLayer === 'floors' ) val = level.map.floors[ cell.z ][ cell.x ];
		else if ( this.activeLayer === 'ceils' ) val = level.map.ceils[ cell.z ][ cell.x ];

		if ( val !== ID_EMPTY ) {

			this.activeAssetId = val;
			this.setTool( 'brush' );

		}

	}

	render() {

		const w = this.canvas.width;
		const h = this.canvas.height;
		const cellW = w / GRID_SIZE;
		const cellH = h / GRID_SIZE;
		const level = this.getLevel();

		this.ctx.fillStyle = '#020617';
		this.ctx.fillRect( 0, 0, w, h );

		// Render Grid Tiles
		for ( let z = 0; z < GRID_SIZE; z ++ ) {

			for ( let x = 0; x < GRID_SIZE; x ++ ) {

				const px = x * cellW;
				const pz = z * cellH;

				// Background Floor color
				const floorId = level.map.floors[ z ][ x ];
				this.ctx.fillStyle = this.getAssetColor( 'floors', floorId, '#1e293b' );
				this.ctx.fillRect( px, pz, cellW, cellH );

				// Entity / Wall overlay
				const entId = level.map.entities[ z ][ x ];
				if ( entId !== ID_EMPTY ) {

					if ( entId === ID_PLAYER_SPAWN ) {

						this.ctx.fillStyle = '#38bdf8';
						this.ctx.fillRect( px + 4, pz + 4, cellW - 8, cellH - 8 );
						this.ctx.fillStyle = '#ffffff';
						this.ctx.font = 'bold 12px sans-serif';
						this.ctx.textAlign = 'center';
						this.ctx.fillText( 'P', px + cellW / 2, pz + cellH / 2 + 4 );

					} else if ( entId === ID_EXIT_GOAL ) {

						this.ctx.fillStyle = '#22c55e';
						this.ctx.fillRect( px + 4, pz + 4, cellW - 8, cellH - 8 );
						this.ctx.fillStyle = '#ffffff';
						this.ctx.font = 'bold 12px sans-serif';
						this.ctx.textAlign = 'center';
						this.ctx.fillText( 'EXIT', px + cellW / 2, pz + cellH / 2 + 4 );

					} else {

						this.ctx.fillStyle = this.getAssetColor( 'walls', entId, '#f59e0b' );
						this.ctx.fillRect( px + 2, pz + 2, cellW - 4, cellH - 4 );

					}

				}

				// Grid Lines
				this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
				this.ctx.lineWidth = 1;
				this.ctx.strokeRect( px, pz, cellW, cellH );

			}

		}

		// Drag Preview Box for Box Fill / Line Tool
		if ( this.isDragging && ( this.activeTool === 'box_fill' || this.activeTool === 'line' ) ) {

			const minX = Math.min( this.dragStart.x, this.dragCurrent.x ) * cellW;
			const maxX = ( Math.max( this.dragStart.x, this.dragCurrent.x ) + 1 ) * cellW;
			const minZ = Math.min( this.dragStart.z, this.dragCurrent.z ) * cellH;
			const maxZ = ( Math.max( this.dragStart.z, this.dragCurrent.z ) + 1 ) * cellH;

			this.ctx.strokeStyle = '#38bdf8';
			this.ctx.lineWidth = 2;
			this.ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
			this.ctx.fillRect( minX, minZ, maxX - minX, maxZ - minZ );
			this.ctx.strokeRect( minX, minZ, maxX - minX, maxZ - minZ );

		}

	}

	getAssetColor( category, id, fallback ) {

		const list = this.cartridge.globalPalette[ category ] || [];
		const item = list.find( i => i.id === id );
		if ( item && item.color ) return item.color;

		// Fallback check in other categories
		for ( const cat of [ 'walls', 'enemies', 'items' ] ) {

			const found = ( this.cartridge.globalPalette[ cat ] || [] ).find( i => i.id === id );
			if ( found && found.color ) return found.color;

		}

		return fallback;

	}

}
