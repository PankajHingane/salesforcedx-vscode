import * as vscode from 'vscode';
import * as child_process from 'child_process';
import * as path from 'path';
import * as net from 'net';
import * as portFinder from 'portfinder';
import * as requirements from './requirements';
import { LanguageClient, LanguageClientOptions, ServerOptions, StreamInfo } from 'vscode-languageclient';

const UBER_JAR_NAME = 'apex-jorje-lsp.jar';
const JDWP_DEBUG_PORT = 2739;
const APEX_LANGUAGE_SERVER_MAIN = 'apex.jorje.lsp.ApexLanguageServerLauncher';

declare var v8debug: any;
const DEBUG = (typeof v8debug === 'object') || startedInDebugMode();

async function createServer(context: vscode.ExtensionContext): Promise<StreamInfo> {
    try {
        let requirementsData = await requirements.resolveRequirements();
        return new Promise<any>((resolve, reject) => {
            portFinder.getPort((err, port) => {
                let uberJar = path.resolve(context.extensionPath, 'dist', UBER_JAR_NAME);
                let javaExecutable = path.resolve(`${requirementsData.java_home}/bin/java`);
                let args: string[];
                if (DEBUG) {
                    args = [
                        '-cp',
                        uberJar,
                        `-Dapex-lsp.port=${port}`,
                        '-Ddebug.internal.errors=true',
                        '-Ddebug.semantic.errors=false',
                        '-Dtrace.protocol=false',
                        `-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=${JDWP_DEBUG_PORT}`,
                        APEX_LANGUAGE_SERVER_MAIN
                    ];
                } else {
                    args = [
                        '-cp',
                        uberJar,
                        `-Dapex-lsp.port=${port}`,
                        '-Ddebug.internal.errors=true',
                        '-Ddebug.semantic.errors=false',
                        APEX_LANGUAGE_SERVER_MAIN
                    ]
                }

                net.createServer(socket => {
                    resolve({
                        reader: socket,
                        writer: socket
                    });

                }).listen(port, () => {
                    let options = {
                        cwd: vscode.workspace.rootPath
                    };

                    let lspProcess = child_process.spawn(javaExecutable, args, options);
                    console.log('PROCESS INFO');
                    console.log(lspProcess);

                    lspProcess.stdout.on('data', (data) => {
                        console.log(`${data}`);
                    });
                    lspProcess.stderr.on('data', (data) => {
                        console.log(`${data}`);
                    });
                    lspProcess.on('close', (code) => {
                        console.log(`language server exited with code: ${code}`);
                    });
                });
            });
        });
    } catch (err) {
        vscode.window.showErrorMessage(err);
        throw err;
    }
}

function startedInDebugMode(): boolean {
    let args = (process as any).execArgv;
    if (args) {
        return args.some((arg: any) => /^--debug=?/.test(arg) || /^--debug-brk=?/.test(arg));
    };
    return false;
}

export function createLanguageServer(context: vscode.ExtensionContext): LanguageClient {
    let clientOptions: LanguageClientOptions = {
        // Register the server for Apex documents
        documentSelector: ['apex'],
        synchronize: {
            configurationSection: 'apex',
            fileEvents: [
                vscode.workspace.createFileSystemWatcher('**/*.cls'), // Apex classes
                vscode.workspace.createFileSystemWatcher('**/*.trigger'), // Apex triggers
                vscode.workspace.createFileSystemWatcher('**/sfdx-project.json') // SFDX workspace configuration file
            ]
        }
    };

    let client = new LanguageClient('apex', 'Apex Language Server', () => createServer(context), clientOptions);
    return client;
}