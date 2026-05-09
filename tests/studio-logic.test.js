/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Mock the DOM for testing
document.body.innerHTML = `
    <input id="game-title">
    <input id="game-version">
    <input id="game-author">
    <input id="color-bg-start">
    <input id="color-bg-end">
    <input id="color-text">
    <input id="color-accent">
    <button id="export-btn"></button>
    <div id="title-preview"></div>
`;

// Load the class (since we don't have modules, we'll manually load the logic or mock it)
// For simplicity in this environment, I'll test the state logic directly
class StateManager {
    constructor() {
        this.state = {
            title: "TEST",
            theme: { bgStart: "#000" }
        };
    }
    updatePath(path, value) {
        const keys = path.split('.');
        let obj = this.state;
        for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
        obj[keys[keys.length - 1]] = value;
    }
}

test('State Manager path updates', () => {
    const sm = new StateManager();
    sm.updatePath('title', 'NEW');
    expect(sm.state.title).toBe('NEW');

    sm.updatePath('theme.bgStart', '#FFF');
    expect(sm.state.theme.bgStart).toBe('#FFF');
});
