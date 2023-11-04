import { Plugin } from "obsidian";

import { EditorMenuCreator } from "@events/editorMenuCreator";
import { MainPluginSettingTab } from "@settings/settingTab";
import { DEFAULT_SETTINGS } from "@settings/settingTypes";

import __wbg_init, { initSync } from "../wasm/pkg/formatto_wasm.js";
import formatto_wasm from "../wasm/pkg/formatto_wasm_bg.wasm";

import type { MainPluginSettings } from "@settings/settingTypes";

//* ENTRY POINT
export default class MainPlugin extends Plugin {
    settings: MainPluginSettings;

    // Load and Save Settings
    async loadSettings() {
        this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            await this.loadData()
        );
    }
    async saveSettings() {
        await this.saveData(this.settings);
    }

    // Runs whenever the user starts using the plugin in Obsidian.
    async onload() {
        await this.loadSettings();
        this.addSettingTab(new MainPluginSettingTab(this.app, this));

        this.events.forEach((item) => {
            this.registerEvent(item);
        });

        console.log("Plugin Loaded: Formatto");

        const wasmStatus =
            (await this.webAssembly).status() === 1 ? "OK" : "ERR";
        console.log(`WebAssembly Status: ${wasmStatus}`);
    }

    // Runs when the plugin is disabled.
    onunload() {
        console.log("Plugin Unloaded: Formatto");
    }

    webAssembly = this.loadWasm();
    private async loadWasm() {
        // @ts-ignore
        return await initSync(await formatto_wasm());
    }

    private eventsMenuCreator = new EditorMenuCreator(this);
    private events = this.eventsMenuCreator.getEventsArr();
}
