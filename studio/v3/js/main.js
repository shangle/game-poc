/**
 * RETRO ENGINE STUDIO 3.0 - MAIN CONTROLLER ENTRY POINT
 */
import { StudioCartridge, ID_EMPTY, ID_PLAYER_SPAWN, ID_EXIT_GOAL } from './core/cartridge.js';
import { StudioAssetManager } from './core/asset_manager.js';
import { StudioGridEditor } from './editor/grid_editor.js';
import { StudioView3D } from './engine/view_3d.js';
import { StudioPlaytestEngine } from './engine/playtest.js';
import { StudioStorageManager } from './core/storage_manager.js';
import { PixelArtEditor } from './ui/pixel_editor.js';

document.addEventListener( 'DOMContentLoaded', () => {

	// 1. Check for URL shared package parameter
	const urlParams = new URLSearchParams( window.location.search );
	const sharedPack = urlParams.get( 'pack' );

	let cartridge;
	if ( sharedPack ) {

		cartridge = StudioCartridge.fromBase64( sharedPack );

	} else {

		const storage = new StudioStorageManager( null );
		cartridge = storage.loadFromLocalStorage() || new StudioCartridge();

	}

	const assetManager = new StudioAssetManager( cartridge );
	const storageManager = new StudioStorageManager( cartridge );
	storageManager.startAutoSave( 5000 );

	// 2. Initialize Viewports
	const gridCanvas = document.getElementById( 'grid-canvas' );
	const gridEditor = new StudioGridEditor( gridCanvas, cartridge, assetManager );

	const view3DContainer = document.getElementById( 'view3d-container' );
	const view3D = new StudioView3D( view3DContainer, cartridge, assetManager );

	const playtestContainer = document.getElementById( 'playtest-container' );
	const playtestEngine = new StudioPlaytestEngine( playtestContainer, cartridge, assetManager );

	const pixelEditorContainer = document.getElementById( 'pixel-editor-container' );
	const pixelArtEditor = new PixelArtEditor( pixelEditorContainer, assetManager );

	// 3. Render Asset Cards Library
	const renderAssetLibrary = () => {

		const container = document.getElementById( 'asset-cards-container' );
		container.innerHTML = '';

		const createCard = ( id, name, color, isSystem = false ) => {

			const card = document.createElement( 'div' );
			card.className = `asset-card ${gridEditor.activeAssetId === id ? 'selected' : ''}`;

			const preview = document.createElement( 'div' );
			preview.className = 'asset-preview-box';
			preview.style.backgroundColor = color || '#38bdf8';

			const label = document.createElement( 'div' );
			label.className = 'asset-card-name';
			label.innerText = name;

			card.appendChild( preview );
			card.appendChild( label );

			card.onclick = () => {

				gridEditor.setAssetId( id );
				renderAssetLibrary();

			};

			card.oncontextmenu = ( e ) => {

				e.preventDefault();
				pixelArtEditor.openForAsset( `tex_${id}`, color );

			};

			container.appendChild( card );

		};

		if ( gridEditor.activeLayer === 'entities' ) {

			createCard( ID_EMPTY, 'ERASER', '#0f172a', true );
			createCard( ID_PLAYER_SPAWN, 'PLAYER', '#38bdf8', true );
			createCard( ID_EXIT_GOAL, 'EXIT GOAL', '#22c55e', true );

			( cartridge.globalPalette.walls || [] ).forEach( w => createCard( w.id, w.name, w.color ) );
			( cartridge.globalPalette.enemies || [] ).forEach( e => createCard( e.id, e.name, e.color ) );
			( cartridge.globalPalette.items || [] ).forEach( i => createCard( i.id, i.name, i.color ) );

		} else if ( gridEditor.activeLayer === 'floors' ) {

			( cartridge.globalPalette.floors || [] ).forEach( f => createCard( f.id, f.name, f.color ) );

		} else if ( gridEditor.activeLayer === 'ceils' ) {

			( cartridge.globalPalette.ceils || [] ).forEach( c => createCard( c.id, c.name, c.color ) );

		}

	};

	renderAssetLibrary();

	// 4. Bind Toolbar Tools
	const bindTool = ( id, toolName ) => {

		const btn = document.getElementById( id );
		if ( ! btn ) return;
		btn.onclick = () => {

			document.querySelectorAll( '#toolbar .tool-btn' ).forEach( b => b.classList.remove( 'active' ) );
			btn.classList.add( 'active' );
			gridEditor.setTool( toolName );

		};

	};

	bindTool( 'tool-brush', 'brush' );
	bindTool( 'tool-box-fill', 'box_fill' );
	bindTool( 'tool-line', 'line' );
	bindTool( 'tool-eyedropper', 'eyedropper' );
	bindTool( 'tool-eraser', 'eraser' );

	document.getElementById( 'tool-undo' ).onclick = () => gridEditor.undo();
	document.getElementById( 'tool-redo' ).onclick = () => gridEditor.redo();

	// 5. Bind Layer Buttons
	const bindLayer = ( id, layerName ) => {

		const btn = document.getElementById( id );
		if ( ! btn ) return;
		btn.onclick = () => {

			document.querySelectorAll( '#asset-panel .btn-secondary' ).forEach( b => b.classList.remove( 'active' ) );
			btn.classList.add( 'active' );
			gridEditor.setLayer( layerName );
			renderAssetLibrary();

		};

	};

	bindLayer( 'layer-entities', 'entities' );
	bindLayer( 'layer-floors', 'floors' );
	bindLayer( 'layer-ceils', 'ceils' );

	// 6. Bind Custom Asset Creation
	document.getElementById( 'create-custom-asset-btn' ).onclick = () => {

		const name = prompt( 'Enter Custom Asset Name:', 'Custom Tile' );
		if ( ! name ) return;

		if ( gridEditor.activeLayer === 'entities' ) {

			assetManager.createCustomWall( name, '#ec4899' );

		} else if ( gridEditor.activeLayer === 'floors' ) {

			assetManager.createCustomFloor( name, '#a855f7' );

		}
		renderAssetLibrary();

	};

	// 7. Bind Playtest Mode
	const startPlaytest = () => {

		playtestContainer.classList.remove( 'hidden' );
		playtestEngine.start( gridEditor.currentLevelIndex );

	};

	document.getElementById( 'btn-playtest' ).onclick = startPlaytest;
	window.addEventListener( 'keydown', ( e ) => {

		if ( e.key.toLowerCase() === 'p' && ! playtestEngine.active && e.target.tagName !== 'INPUT' ) {

			startPlaytest();

		} else if ( e.key === 'Escape' && playtestEngine.active ) {

			playtestEngine.stop();
			playtestContainer.classList.add( 'hidden' );

		}

	} );

	// 8. Bind Share URL & Export/Import
	document.getElementById( 'btn-share-url' ).onclick = () => {

		const shareUrl = storageManager.generateShareUrl();
		navigator.clipboard.writeText( shareUrl );
		alert( 'Shareable URL copied to clipboard!\n\n' + shareUrl );

	};

	document.getElementById( 'btn-export-json' ).onclick = () => {

		storageManager.downloadCartridgeJson();

	};

	document.getElementById( 'btn-import-json' ).onclick = () => {

		const input = document.createElement( 'input' );
		input.type = 'file';
		input.accept = '.json';
		input.onchange = ( e ) => {

			const file = e.target.files[ 0 ];
			if ( file ) {

				storageManager.importCartridgeJson( file, ( newCartridge ) => {

					cartridge.fromJSON( newCartridge.toJSON() );
					gridEditor.render();
					view3D.buildLevel( 0 );
					renderAssetLibrary();

				} );

			}

		};
		input.click();

	};

	// 9. Level Tabs Management
	const renderLevelTabs = () => {

		const tabsContainer = document.getElementById( 'level-tabs-container' );
		tabsContainer.innerHTML = '';

		cartridge.levels.forEach( ( lvl, idx ) => {

			const tab = document.createElement( 'div' );
			tab.className = `level-tab ${gridEditor.currentLevelIndex === idx ? 'active' : ''}`;
			tab.innerText = lvl.name || `Stage ${idx + 1}`;
			tab.onclick = () => {

				gridEditor.currentLevelIndex = idx;
				renderLevelTabs();
				gridEditor.render();
				view3D.buildLevel( idx );

			};
			tabsContainer.appendChild( tab );

		} );

		const addBtn = document.createElement( 'button' );
		addBtn.className = 'level-tab';
		addBtn.style.background = 'transparent';
		addBtn.style.border = 'none';
		addBtn.style.color = '#38bdf8';
		addBtn.innerText = '+ New Stage';
		addBtn.onclick = () => {

			cartridge.addLevel( `Stage ${cartridge.levels.length + 1}` );
			gridEditor.currentLevelIndex = cartridge.levels.length - 1;
			renderLevelTabs();
			gridEditor.render();
			view3D.buildLevel( gridEditor.currentLevelIndex );

		};
		tabsContainer.appendChild( addBtn );

	};

	renderLevelTabs();

} );
