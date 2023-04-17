import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Odo } from './odo';

export class ComponentsProvider implements vscode.TreeDataProvider<Component> {

    private _onDidChangeTreeData: vscode.EventEmitter<Component | undefined | void> = new vscode.EventEmitter<Component | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<Component | undefined | void> = this._onDidChangeTreeData.event;

    constructor(private workspaceRoot: string | undefined) {
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: Component): vscode.TreeItem {
        return element;
    }

    getChildren(element?: Component): Thenable<Component[]> {
        if (!this.workspaceRoot) {
            vscode.window.showInformationMessage('No dependency in empty workspace');
            return Promise.resolve([]);
        }



        if (!element) {
            //Promise.resolve(this.getComponents());
        }

        return Promise.resolve([]);
    }



    private getComponents(): Component[] {
        const components = Odo.getOdoComponents();

        console.log(components);


        // TODO: componenents.map fails
        return components.map((component) => {
            return new Component(component.name, vscode.TreeItemCollapsibleState.Collapsed);
        });
    }

}


export class Component extends vscode.TreeItem {

    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);

        this.tooltip = `${this.label}`;
        this.description = ``;
    }

    contextValue = 'component';
}