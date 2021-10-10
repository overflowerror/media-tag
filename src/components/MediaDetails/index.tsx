import React, {FunctionComponent, useEffect, useState} from "react";
import {MediaFile} from "../../database/file";
import MediaPreview from "../MediaPreview";
import Autocomplete from "../Autocomplete";

export type MediaDetailsProps = {
    basePath: string,
    file: MediaFile,
    onUpdate: (file: MediaFile) => void,
    allTags: string[]
}

const MediaDetails: FunctionComponent<MediaDetailsProps> = ({basePath, file, onUpdate, allTags}) => {
    const [currentFile, setCurrentFile] = useState<MediaFile>(file)
    const [hasChanges, setHasChanges] = useState<boolean>(false)

    const [newTagInput, setNewTagInput] = useState<string>("")

    useEffect(() => {
        if (currentFile.getPath() != file.getPath()) {
            setCurrentFile(file)
            setHasChanges(false)
            setNewTagInput("")
        }
    }, [file])

    const removeTag = (tag: string) => {
        const clone = currentFile.clone()
        clone.removeTag(tag)
        setCurrentFile(clone)
        setHasChanges(true)
    }

    const addTag = (tag: string) => {
        const clone = currentFile.clone()
        clone.addTag(tag)
        setCurrentFile(clone)
        setHasChanges(true)
    }

    return (
        <div>
            <MediaPreview basePath={basePath} file={currentFile} />
            <div>
                Path: {currentFile.getPath()} <br />
                Tags:
                <ul>
                    {
                        currentFile.getTags().map(t => (
                            <li key={t}>{t} <a onClick={() => removeTag(t)}>-</a> </li>
                        ))
                    }
                    <li>
                        <Autocomplete
                            value={newTagInput}
                            options={allTags}
                            onChange={(value) => {
                                setNewTagInput(value)
                            }}
                        />
                        <button
                            onClick={() => {
                                addTag(newTagInput)
                                setNewTagInput("")
                            }}
                            disabled={currentFile.getTags().indexOf(newTagInput) >= 0}
                        >
                            Add
                        </button>
                    </li>
                </ul>
            </div>
            { hasChanges &&
                <button onClick={() => {
                    onUpdate(currentFile)
                    setHasChanges(false)
                }}>Save</button>
            }
        </div>
    )
}

export default MediaDetails