/**
 * LEVEL SEQUENCER & MAP VISUALIZER
 * Implementation of the "Mario Maker" style world map / level switcher.
 */

const Sequencer = {
    render() {
        const container = document.getElementById('sequencer-grid');
        if (!container) return;
        container.innerHTML = '';

        // Add Title Screen Node
        const titleNode = this.createNode('Title Screen', 'title-screen', () => {
            alert('Title Screen Editor Coming Soon!');
        });
        container.appendChild(titleNode);

        // Add Level Nodes
        gamePack.levels.forEach((level, index) => {
            const node = this.createNode(level.name, index === activeLevelIndex ? 'active' : '', () => {
                this.selectLevel(index);
            });
            container.appendChild(node);
        });

        // Add "New Level" Button
        const addNode = document.createElement('div');
        addNode.className = 'level-node add-level';
        addNode.innerHTML = `
            <div class="level-preview" style="display:flex; align-items:center; justify-content:center; background:#1e293b;">
                <span style="font-size:32px;">+</span>
            </div>
            <div class="level-name">New Level</div>
        `;
        addNode.onclick = () => this.addNewLevel();
        container.appendChild(addNode);
    },

    createNode(name, extraClass, onClick) {
        const node = document.createElement('div');
        node.className = `level-node ${extraClass}`;
        node.innerHTML = `
            <div class="level-preview"></div>
            <div class="level-name">${name}</div>
        `;
        node.onclick = onClick;
        return node;
    },

    selectLevel(index) {
        activeLevelIndex = index;
        gameData = getActiveLevel(); // Update pointer for engine
        setUIMode('EDITOR');
        renderUI();
    },

    addNewLevel() {
        const newId = `lvl_${Date.now()}`;
        const newLevel = {
            id: newId,
            name: `Level ${gamePack.levels.length + 1}`,
            map: {
                floors: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(101)),
                ceils:  Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(201)),
                entities: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0))
            },
            assets: {},
            exits: []
        };
        gamePack.levels.push(newLevel);
        this.render();
    },

    open() {
        setUIMode('SEQUENCER');
        this.render();
    }
};

window.Sequencer = Sequencer;
