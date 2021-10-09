import React, {FunctionComponent} from "react";
import {MediaFile} from "../../database/file";
import MediaPreview from "../MediaPreview";

export type MediaListItemProps = {
    basePath: string,
    file: MediaFile
}

const MediaListItem: FunctionComponent<MediaListItemProps> = ({basePath, file}) => {
    return (
        <div>
            <MediaPreview basePath={basePath} file={file} />
            <div>
                Tags:
                <ul>
                    {
                        file.getTags().map(t => (
                            <li key={t}>{t}</li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}

export default MediaListItem