import * as fsPromises from "fs/promises";
import {Database} from "../database/database";
import {FileTypeFromExtension, MediaFileType} from "../database/file-type";

const DB_FILE = ".tagdb"

class Repository {
    private readonly path: string
    private cached?: Database

    constructor(path: string) {
        this.path = path
    }

    public getPath(): string {
        return this.path
    }

    public async get(): Promise<Database> {
        if (!this.cached) {
            const buffer = await fsPromises.readFile(this.path + "/" + DB_FILE)
            const raw = JSON.parse(buffer.toString())
            this.cached = Database.fromRaw(raw)
        }
        return this.cached
    }

    public async reload(): Promise<Database> {
        this.cached = undefined
        return this.get()
    }

    public async exists(): Promise<boolean> {
        try {
            await this.get()
            return true
        } catch (e) {
            return false
        }
    }

    public new(db: Database) {
        this.cached = db
    }

    public async write(): Promise<void> {
        await fsPromises.writeFile(this.path + "/" + DB_FILE, JSON.stringify(this.cached.toRaw()))
    }

    public async findUntagged(): Promise<string[]> {
        const db = await this.get()
        const untagged = db.findUntaggedPathsInDb()

        await db.forEachDirectory(async d => {
            const entries = await fsPromises.readdir(this.path + "/" + d, {withFileTypes: true})
            entries
                .filter(e => e.isFile())
                .map(e => e.name)
                .filter(f => FileTypeFromExtension(f) != MediaFileType.unknown)
                .filter(f => !db.hasFile(f))
                .forEach(f => untagged.push(f))
        })

        return untagged.filter((v, i, s) => s.indexOf(v) == i)
    }

    public update(db: Database) {
        this.cached = db
    }
}

export default Repository