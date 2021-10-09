import React, {FunctionComponent} from "react";
import {MediaFile} from "../../database/file";
import MediaPreview from "../MediaPreview";

export type MediaDetailsProps = {
    basePath: string,
    file: MediaFile
}

const MediaDetails: FunctionComponent<MediaDetailsProps> = ({basePath, file}) => {
    return (
        <div>
            <MediaPreview basePath={basePath} file={file} />
            <div>
                Path: {file.getPath()} <br />
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

export default MediaDetails