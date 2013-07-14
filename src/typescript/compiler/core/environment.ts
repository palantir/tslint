///<reference path='references.ts' />
///<reference path='..\enumerator.ts' />
///<reference path='..\process.ts' />

enum ByteOrderMark {
    None,
    Utf8,
    Utf16BigEndian,
    Utf16LittleEndian,
}

class FileInformation {
    private _contents: string;
    private _byteOrderMark: ByteOrderMark;

    constructor(contents: string, byteOrderMark: ByteOrderMark) {
        this._contents = contents;
        this._byteOrderMark = byteOrderMark;
    }

    public contents(): string {
        return this._contents;
    }

    public byteOrderMark(): ByteOrderMark {
        return this._byteOrderMark;
    }
}

interface IEnvironment {
    readFile(path: string): FileInformation;
    writeFile(path: string, contents: string, writeByteOrderMark: boolean): void;
    deleteFile(path: string): void;
    fileExists(path: string): boolean;
    directoryExists(path: string): boolean;
    listFiles(path: string, re?: RegExp, options?: { recursive?: boolean; }): string[];

    arguments: string[];
    standardOut: ITextWriter;

    currentDirectory(): string;
}

var Environment = (function () {
    // Create an IO object for use inside WindowsScriptHost hosts
    // Depends on WSCript and FileSystemObject
    function getWindowsScriptHostEnvironment(): IEnvironment {
        try {
            var fso = new ActiveXObject("Scripting.FileSystemObject");
        } catch (e) {
            return null;
        }

        var streamObjectPool = [];

        function getStreamObject(): any {
            if (streamObjectPool.length > 0) {
                return streamObjectPool.pop();
            } else {
                return new ActiveXObject("ADODB.Stream");
            }
        }

        function releaseStreamObject(obj: any) {
            streamObjectPool.push(obj);
        }

        var args = [];
        for (var i = 0; i < WScript.Arguments.length; i++) {
            args[i] = WScript.Arguments.Item(i);
        }

        return {
            currentDirectory: (): string => {
                return (<any>WScript).CreateObject("WScript.Shell").CurrentDirectory;
            },

            readFile: function (path): FileInformation {
                try {
                    // Initially just read the first two bytes of the file to see if there's a bom.
                    var streamObj = getStreamObject();
                    streamObj.Open();
                    streamObj.Type = 2; // Text data

                    // Start reading individual chars without any interpretation.  That way we can check for a bom.
                    streamObj.Charset = 'x-ansi';

                    streamObj.LoadFromFile(path);
                    var bomChar = streamObj.ReadText(2); // Read the BOM char

                    // Position has to be at 0 before changing the encoding
                    streamObj.Position = 0;

                    var byteOrderMark = ByteOrderMark.None;

                    if (bomChar.charCodeAt(0) === 0xFE && bomChar.charCodeAt(1) === 0xFF) {
                        streamObj.Charset = 'unicode';
                        byteOrderMark = ByteOrderMark.Utf16BigEndian;
                    }
                    else if (bomChar.charCodeAt(0) === 0xFF && bomChar.charCodeAt(1) === 0xFE) {
                        streamObj.Charset = 'unicode';
                        byteOrderMark = ByteOrderMark.Utf16LittleEndian;
                    }
                    else if (bomChar.charCodeAt(0) === 0xEF && bomChar.charCodeAt(1) === 0xBB) {
                        streamObj.Charset = 'utf-8';
                        byteOrderMark = ByteOrderMark.Utf8;
                    }
                    else {
                        // Always read a file as utf8 if it has no bom.
                        streamObj.Charset = 'utf-8';
                    }

                    // Read the whole file
                    var contents = streamObj.ReadText(-1 /* read from the current position to EOS */);
                    streamObj.Close();
                    releaseStreamObject(streamObj);
                    return new FileInformation(contents, byteOrderMark);
                }
                catch (err) {
                    var error: any = new Error(err.message);
                    // -2147024809 is the javascript value for 0x80070057 which is the HRESULT for 
                    // "the parameter is incorrect".
                    var message: string;
                    if (err.number === -2147024809) {
                        error.isUnsupportedEncoding = true;
                    }

                    throw error;
                }
            },

            writeFile: function (path, contents, writeByteOrderMark: boolean) {
                // First, convert the text contents passed in to binary in UTF8 format.
                var textStream = getStreamObject();
                textStream.Charset = 'utf-8';
                textStream.Open();
                textStream.WriteText(contents, 0 /*do not add newline*/);

                // If they don't want the BOM, then skip it (it will be added autoamtically
                // when we write the utf8 bytes out above).
                if (!writeByteOrderMark) {
                    textStream.Position = 3;
                }
                else {
                    textStream.Position = 0;
                }

                // Now, write all those bytes out to a file.
                var fileStream = getStreamObject();
                fileStream.Type = 1; //binary data.
                fileStream.Open();

                textStream.CopyTo(fileStream);

                // Flush and save the file.
                fileStream.Flush();
                fileStream.SaveToFile(path, 2 /*overwrite*/);
                fileStream.Close();

                textStream.Flush();
                textStream.Close();
            },

            fileExists: function (path: string): boolean {
                return fso.FileExists(path);
            },

            deleteFile: function (path: string): void {
                if (fso.FileExists(path)) {
                    fso.DeleteFile(path, true); // true: delete read-only files
                }
            },

            directoryExists: function (path) {
                return <boolean>fso.FolderExists(path);
            },

            listFiles: function (path, spec?, options?) {
                options = options || <{ recursive?: boolean; }>{};
                function filesInFolder(folder, root): string[] {
                    var paths = [];
                    var fc: Enumerator;

                    if (options.recursive) {
                        fc = new Enumerator(folder.subfolders);

                        for (; !fc.atEnd(); fc.moveNext()) {
                            paths = paths.concat(filesInFolder(fc.item(), root + "\\" + fc.item().Name));
                        }
                    }

                    fc = new Enumerator(folder.files);

                    for (; !fc.atEnd(); fc.moveNext()) {
                        if (!spec || fc.item().Name.match(spec)) {
                            paths.push(root + "\\" + fc.item().Name);
                        }
                    }

                    return paths;
                }

                var folder = fso.GetFolder(path);
                var paths = [];

                return filesInFolder(folder, path);
            },

            arguments: <string[]>args,

            standardOut: WScript.StdOut,
        };
    };

    function getNodeEnvironment(): IEnvironment {
        var _fs = require('fs');
        var _path = require('path');
        var _module = require('module');

        return {
            currentDirectory: (): string => {
                return (<any>process).cwd();
            },

            readFile: function (file: string): FileInformation {
                var buffer = _fs.readFileSync(file);
                switch (buffer[0]) {
                    case 0xFE:
                        if (buffer[1] === 0xFF) {
                            // utf16-be. Reading the buffer as big endian is not supported, so convert it to 
                            // Little Endian first
                            var i = 0;
                            while ((i + 1) < buffer.length) {
                                var temp = buffer[i];
                                buffer[i] = buffer[i + 1];
                                buffer[i + 1] = temp;
                                i += 2;
                            }
                            return new FileInformation(buffer.toString("ucs2", 2), ByteOrderMark.Utf16BigEndian);
                        }
                        break;
                    case 0xFF:
                        if (buffer[1] === 0xFE) {
                            // utf16-le 
                            return new FileInformation(buffer.toString("ucs2", 2), ByteOrderMark.Utf16LittleEndian);
                        }
                        break;
                    case 0xEF:
                        if (buffer[1] === 0xBB) {
                            // utf-8
                            return new FileInformation(buffer.toString("utf8", 3), ByteOrderMark.Utf8);
                        }
                }

                // Default behaviour
                return new FileInformation(buffer.toString("utf8", 0), ByteOrderMark.None);
            },

            writeFile: function (path: string, contents: string, writeByteOrderMark: boolean) {
                function mkdirRecursiveSync(path) {
                    var stats = _fs.statSync(path);
                    if (stats.isFile()) {
                        throw "\"" + path + "\" exists but isn't a directory.";
                    } else if (stats.isDirectory()) {
                        return;
                    } else {
                        mkdirRecursiveSync(_path.dirname(path));
                        _fs.mkdirSync(path, 0775);
                    }
                }
                mkdirRecursiveSync(_path.dirname(path));

                if (writeByteOrderMark) {
                    contents = '\uFEFF' + contents;
                }
                _fs.writeFileSync(path, contents, "utf8");
            },

            fileExists: function (path): boolean {
                return _fs.existsSync(path);
            },

            deleteFile: function (path) {
                try {
                    _fs.unlinkSync(path);
                } catch (e) {
                }
            },

            directoryExists: function (path: string): boolean {
                return _fs.existsSync(path) && _fs.statSync(path).isDirectory();
            },

            listFiles: function dir(path, spec?, options?) {
                options = options || <{ recursive?: boolean; }>{};

                function filesInFolder(folder: string): string[] {
                    var paths = [];

                    var files = _fs.readdirSync(folder);
                    for (var i = 0; i < files.length; i++) {
                        var stat = _fs.statSync(folder + "\\" + files[i]);
                        if (options.recursive && stat.isDirectory()) {
                            paths = paths.concat(filesInFolder(folder + "\\" + files[i]));
                        } else if (stat.isFile() && (!spec || files[i].match(spec))) {
                            paths.push(folder + "\\" + files[i]);
                        }
                    }

                    return paths;
                }

                return filesInFolder(path);
            },

            arguments: process.argv.slice(2),

            standardOut: {
                Write: function (str) { process.stdout.write(str); },
                WriteLine: function (str) { process.stdout.write(str + '\n'); },
                Close: function () { }
            },
        };
    };

    if (typeof WScript !== "undefined" && typeof ActiveXObject === "function") {
        return getWindowsScriptHostEnvironment();
    }
    else if (typeof module !== 'undefined' && module.exports) {
        return getNodeEnvironment();
    }
    else {
        return null; // Unsupported host
    }
})();
