/**
 * RETRO ENGINE STUDIO 3.0 - BUILT-IN PIXEL ART TEXTURE CREATOR
 */

export class PixelArtEditor {

	constructor( container, assetManager ) {

		this.container = container;
		this.assetManager = assetManager;

		this.gridSize = 16;
		this.currentColor = '#38bdf8';
		this.currentTool = 'pencil'; // 'pencil', 'bucket', 'eraser'
		this.activeTexKey = null;

		this.pixels = Array( 16 * 16 ).fill( '#475569' );

		this.init();

	}

	init() {

		this.container.innerHTML = `
            <div class="pixel-editor-modal bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl max-w-lg w-full">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-white font-black uppercase text-sm tracking-wider">🎨 Pixel Art Texture Editor</h3>
                    <button id="close-pixel-editor" class="text-slate-400 hover:text-white font-bold">✕</button>
                </div>
                
                <div class="flex gap-6 justify-center mb-4">
                    <!-- Canvas Grid -->
                    <canvas id="pixel-canvas" width="256" height="256" class="border-2 border-slate-700 rounded-lg cursor-crosshair"></canvas>
                    
                    <!-- Tools & Palette -->
                    <div class="flex flex-col gap-3">
                        <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tools</div>
                        <div class="flex gap-2">
                            <button id="tool-pencil" class="btn btn-sm btn-primary px-3 py-1 text-xs">✏️ Pencil</button>
                            <button id="tool-bucket" class="btn btn-sm btn-secondary px-3 py-1 text-xs">🪣 Bucket</button>
                            <button id="tool-eraser" class="btn btn-sm btn-secondary px-3 py-1 text-xs">🧹 Eraser</button>
                        </div>

                        <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2">Color Palette</div>
                        <input type="color" id="pixel-color-picker" value="#38bdf8" class="w-full h-8 cursor-pointer rounded border-0">
                        
                        <div class="grid grid-cols-4 gap-1.5 mt-1" id="preset-colors">
                            <div class="w-6 h-6 rounded cursor-pointer border border-white/20" style="background:#ef4444" data-color="#ef4444"></div>
                            <div class="w-6 h-6 rounded cursor-pointer border border-white/20" style="background:#f97316" data-color="#f97316"></div>
                            <div class="w-6 h-6 rounded cursor-pointer border border-white/20" style="background:#eab308" data-color="#eab308"></div>
                            <div class="w-6 h-6 rounded cursor-pointer border border-white/20" style="background:#22c55e" data-color="#22c55e"></div>
                            <div class="w-6 h-6 rounded cursor-pointer border border-white/20" style="background:#06b6d4" data-color="#06b6d4"></div>
                            <div class="w-6 h-6 rounded cursor-pointer border border-white/20" style="background:#3b82f6" data-color="#3b82f6"></div>
                            <div class="w-6 h-6 rounded cursor-pointer border border-white/20" style="background:#a855f7" data-color="#a855f7"></div>
                            <div class="w-6 h-6 rounded cursor-pointer border border-white/20" style="background:#ec4899" data-color="#ec4899"></div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end gap-3 pt-4 border-t border-slate-800">
                    <button id="save-pixel-texture" class="bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-2 rounded-xl text-sm transition-colors">
                        SAVE TEXTURE
                    </button>
                </div>
            </div>
        `;

		this.canvas = this.container.querySelector( '#pixel-canvas' );
		this.ctx = this.canvas.getContext( '2d' );

		this.bindEvents();
		this.render();

	}

	openForAsset( texKey, baseColor = '#38bdf8' ) {

		this.activeTexKey = texKey;
		this.currentColor = baseColor;
		this.container.querySelector( '#pixel-color-picker' ).value = baseColor;
		this.pixels.fill( baseColor );
		this.container.classList.remove( 'hidden' );
		this.render();

	}

	bindEvents() {

		let isDrawing = false;

		const getPixelCoords = ( e ) => {

			const rect = this.canvas.getBoundingClientRect();
			const x = Math.floor( ( e.clientX - rect.left ) / ( rect.width / this.gridSize ) );
			const y = Math.floor( ( e.clientY - rect.top ) / ( rect.height / this.gridSize ) );
			return {
				x: Math.max( 0, Math.min( this.gridSize - 1, x ) ),
				y: Math.max( 0, Math.min( this.gridSize - 1, y ) )
			};

		};

		const paintPixel = ( e ) => {

			const { x, y } = getPixelCoords( e );
			const idx = y * this.gridSize + x;
			if ( this.currentTool === 'pencil' ) {

				this.pixels[ idx ] = this.currentColor;

			} else if ( this.currentTool === 'eraser' ) {

				this.pixels[ idx ] = 'rgba(0,0,0,0)';

			} else if ( this.currentTool === 'bucket' ) {

				this.pixels.fill( this.currentColor );

			}
			this.render();

		};

		this.canvas.addEventListener( 'mousedown', ( e ) => {

			isDrawing = true; paintPixel( e );

		} );
		this.canvas.addEventListener( 'mousemove', ( e ) => {

			if ( isDrawing ) paintPixel( e );

		} );
		window.addEventListener( 'mouseup', () => {

			isDrawing = false;

		} );

		// Tool buttons
		this.container.querySelector( '#tool-pencil' ).onclick = () => this.currentTool = 'pencil';
		this.container.querySelector( '#tool-bucket' ).onclick = () => this.currentTool = 'bucket';
		this.container.querySelector( '#tool-eraser' ).onclick = () => this.currentTool = 'eraser';

		// Color picker & presets
		this.container.querySelector( '#pixel-color-picker' ).oninput = ( e ) => this.currentColor = e.target.value;
		this.container.querySelectorAll( '#preset-colors div' ).forEach( el => {

			el.onclick = () => {

				this.currentColor = el.dataset.color;
				this.container.querySelector( '#pixel-color-picker' ).value = this.currentColor;

			};

		} );

		// Save button
		this.container.querySelector( '#save-pixel-texture' ).onclick = () => {

			if ( this.activeTexKey ) {

				const dataUrl = this.canvas.toDataURL();
				this.assetManager.savePixelArtTexture( this.activeTexKey, dataUrl );
				this.container.classList.add( 'hidden' );

			}

		};

		// Close button
		this.container.querySelector( '#close-pixel-editor' ).onclick = () => {

			this.container.classList.add( 'hidden' );

		};

	}

	render() {

		const cellSize = this.canvas.width / this.gridSize;
		this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );

		for ( let y = 0; y < this.gridSize; y ++ ) {

			for ( let x = 0; x < this.gridSize; x ++ ) {

				const idx = y * this.gridSize + x;
				this.ctx.fillStyle = this.pixels[ idx ] || '#475569';
				this.ctx.fillRect( x * cellSize, y * cellSize, cellSize, cellSize );

				this.ctx.strokeStyle = 'rgba(255,255,255,0.05)';
				this.ctx.strokeRect( x * cellSize, y * cellSize, cellSize, cellSize );

			}

		}

	}

}
