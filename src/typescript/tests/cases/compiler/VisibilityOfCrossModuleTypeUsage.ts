// @Filename: commands.ts
import fs = module('fs');
import server = module('server');

export interface IConfiguration {
    workspace: server.IWorkspace;
    server?: server.IServer;
}

// @Filename: fs.ts
import commands = module('commands');
function run(configuration: commands.IConfiguration) {
    var absoluteWorkspacePath = configuration.workspace.toAbsolutePath(configuration.server);
}

// @Filename: server.ts
export interface IServer {
}

export interface IWorkspace {
    toAbsolutePath(server: IServer, workspaceRelativePath?: string): string;
}