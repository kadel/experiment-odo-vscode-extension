import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import * as devfile from '@devfile/api';
import { join } from 'path';


export class DevfileProvider implements vscode.TreeDataProvider<Element> {

    private devfilePath: string;

    private _onDidChangeTreeData: vscode.EventEmitter<Element | undefined | void> = new vscode.EventEmitter<Element | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<Element | undefined | void> = this._onDidChangeTreeData.event;

    constructor(private workspaceRoot: string | undefined) {
        if (this.workspaceRoot) {
            this.devfilePath = join(this.workspaceRoot, 'devfile.yaml');
        } else {
            this.devfilePath = '';
        }
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: Element): vscode.TreeItem {
        return element;
    }

    getChildren(element?: Element): Thenable<Element[]> {
        if (!this.workspaceRoot || !this.pathExists(this.devfilePath)) {
            vscode.window.showInformationMessage('No dependency in empty workspace');
            return Promise.resolve([]);
        }

        if (!element) {
            const devfile = yaml.load(fs.readFileSync(this.devfilePath, 'utf8')) as devfile.V221Devfile;
            const name = devfile.metadata ? devfile.metadata.name || "" : '';

            return Promise.resolve([new Element(name, vscode.TreeItemCollapsibleState.Collapsed, "devfile")]);
        } else if (element.contextValue === "devfile") {

            const rootElements: Array<Element> = [
                new Element('commands', vscode.TreeItemCollapsibleState.Collapsed),
                new Element('components', vscode.TreeItemCollapsibleState.Collapsed)
            ];
            return Promise.resolve(rootElements);
        } else {
            return Promise.resolve(this.getElements(element));
        }

    }

    private getElements(parent: Element): Element[] {
        if (this.workspaceRoot && this.pathExists(this.devfilePath)) {

            // read yaml file this.devfilePath
            const devfile = yaml.load(fs.readFileSync(this.devfilePath, 'utf8')) as devfile.V221Devfile;



            if (parent.label === 'commands') {
                if (devfile.commands === undefined) {
                    return [];
                }

                return devfile.commands.map((command) => {
                    return new Element(command.id, vscode.TreeItemCollapsibleState.None, "command");
                });
            }

            if (parent.label === 'components') {
                if (devfile.commands === undefined) {
                    return [];
                }
              
                    return [new Element("TODO", vscode.TreeItemCollapsibleState.None)];
            
            }
        }
        return [];

    }

    private pathExists(p: string): boolean {
        try {
            fs.accessSync(p);
        } catch (err) {
            return false;
        }

        return true;
    }
}

export class Element extends vscode.TreeItem {

    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly contextValue?: string,
        public readonly command?: vscode.Command
        
    ) {
        super(label, collapsibleState);

        this.tooltip = `${this.label}`;
        this.description = ``;
    }

    iconPath = {
        light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
    };

}