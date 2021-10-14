import {FileTypeFromExtension, MediaFileType} from "./file-type";
import {KEY_FILE_DESCRIPTION, KEY_FILE_GROUP, KEY_FILE_ORDINAL, KEY_FILE_PATH, KEY_FILE_TAGS} from "./config-keys";

export class MediaFile {
    private readonly path: string
    private readonly type: MediaFileType
    private description: string
    private group: string|null
    private ordinal: number|null
    private tags: string[]

    constructor(path: string) {
        this.path = path
        this.type = FileTypeFromExtension(path)
        this.tags = []
        this.ordinal = 0
    }

    public getPath(): string {
        return this.path
    }

    public getType(): MediaFileType {
        return this.type
    }

    public getTags(): string[] {
        return this.tags
    }

    public getDescription(): string {
        return this.description
    }

    public setDescription(description: string) {
        this.description = description
    }

    public getGroup(): string|null {
        return this.group
    }

    public setGroup(group: string) {
        this.group = group
    }

    public addTag(tag: string) {
        if (this.tags.indexOf(tag) < 0) {
            this.tags.push(tag)
        }
    }

    public removeTag(tag: string) {
        const i = this.tags.indexOf(tag)
        if (i >= 0) {
            this.tags.splice(i, 1)
        }
    }

    public hasTag(tag: string): boolean {
        return this.tags.indexOf(tag) >= 0
    }

    static fromRaw(obj: any): MediaFile {
        if (typeof obj[KEY_FILE_PATH] != "string") {
            throw "path attribute has to be string"
        }

        const file = new MediaFile(obj[KEY_FILE_PATH])

        if (!obj[KEY_FILE_TAGS]) {
            throw "tags attribute missing"
        }
        file.tags = obj[KEY_FILE_TAGS].map((t: any) => {
            if (typeof t != "string") {
                throw "tags have to be strings"
            }
            return t
        })

        file.description = ""
        if (typeof obj[KEY_FILE_DESCRIPTION] == "string") {
            file.description = obj[KEY_FILE_DESCRIPTION]
        }

        file.group = null
        if (typeof obj[KEY_FILE_GROUP] == "string") {
            file.group = obj[KEY_FILE_GROUP]
        }

        file.ordinal = null
        if (typeof obj[KEY_FILE_ORDINAL] == "number") {
            file.ordinal = obj[KEY_FILE_ORDINAL]
        }

        return file
    }

    public toRaw(): any {
        const obj = {}

        // @ts-ignore
        obj[KEY_FILE_PATH] = this.path
        // @ts-ignore
        obj[KEY_FILE_TAGS] = this.tags
        // @ts-ignore
        obj[KEY_FILE_DESCRIPTION] = this.description
        // @ts-ignore
        obj[KEY_FILE_GROUP] = this.group
        // @ts-ignore
        obj[KEY_FILE_ORDINAL] = this.ordinal

        return obj
    }

    public clone(): MediaFile {
        const clone = new MediaFile(this.path)
        clone.tags = [...this.tags]
        return clone
    }

    public compareTo(file: MediaFile): number {
        if (!this.group) {
            if (!file.group) {
                return this.path.localeCompare(file.path)
            } else {
                return 1
            }
        } else {
            if (file.group) {
                if (this.group != file.group) {
                    return this.group.localeCompare(file.group)
                } else {
                    return this.ordinal > file.ordinal ? 1 : -1
                }
            } else {
                return -1
            }
        }
    }
}