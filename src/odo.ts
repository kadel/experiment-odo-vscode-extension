
import * as cp from 'child_process';


interface Component{
    managedBy: string;
    managedByVersion: string;
    name: string;
    platform: string;
    projectType: string;
    runningOn: string;
    runningIn: RunningIn;
}

interface RunningIn{
    deploy: boolean;
    dev: boolean;
}

export class Odo {
    static getOdoVersion(): string {
        let version = cp.execSync('odo version').toString();
        return version;
    }

    static getOdoComponents(): Component[] {
        let components = cp.execSync('odo list components -o json').toString();
        return JSON.parse(components) as Component[];
    }
}


