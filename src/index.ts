import { App, Plugin, PluginManifest } from "obsidian";

const defSnippetFolder: string = "css-snippets";

export default class CssSnippetsPlugin extends Plugin {
  public loadedStyles: Array<HTMLStyleElement>;

  constructor(app: App, pluginManifest: PluginManifest) {
    super(app, pluginManifest);
  }

  async onload() {
    this.addCommand({
      id: "refresh-styles",
      name: "Reload",
      callback: async () => {
        this.loadSnippets();
      },
    });

    this.addCommand({
      id: "unload-styles",
      name: "Unload",
      callback: async () => {
        this.unloadSnippets();
      },
    });

    this.loadedStyles = Array<HTMLStyleElement>(0);
    this.loadSnippets();
  }

  onunload() {
    this.unloadSnippets();
  }

  async loadSnippets() {
    this.unloadSnippets();

    // enumerate the style files
    let style_files = await this.app.vault.adapter.list(defSnippetFolder);
    style_files.files;
    for (let fstyle of style_files.files) {
      // console.log( "Found file: ", fstyle );
      if (fstyle.indexOf(".css") < 0) {
        // console.log( "Skipping non css file");
      }

      let content = await this.app.vault.adapter.read(fstyle);
      let css = content;

      var style = document.createElement("style");
      style.innerHTML = css;
      document.head.appendChild(style);
      this.loadedStyles.push(style);
    }
  }

  async unloadSnippets() {
    for (let tag of this.loadedStyles) {
      // console.log( "Removing style tag: ", tag );
      document.head.removeChild(tag);
    }
    this.loadedStyles = Array<HTMLStyleElement>(0);
  }
}
