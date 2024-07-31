import { exec } from 'child_process';
export function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${error.message}`);
            }
            else if (stderr) {
                reject(`Stderr: ${stderr}`);
            }
            else {
                resolve();
            }
        });
    });
}
