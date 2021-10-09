import React, {FunctionComponent} from "react";
import {MediaFile} from "../../database/file";
import {MediaFileType} from "../../database/file-type";

export type MediaPreviewProps = {
    basePath: string,
    file: MediaFile
}

const MediaPreview: FunctionComponent<MediaPreviewProps> = ({basePath, file}) => {
    switch (file.getType()) {
        case MediaFileType.unknown:
            return (
                <div>
                    unknown file type
                </div>
            )
        case MediaFileType.video:
            return (
                <div>
                    videos not yet supported
                </div>
            )
        case MediaFileType.image:
            return (
                <div>
                    <img src={"media://" + basePath + "/" + file.getPath()} alt={file.getPath()} />
                </div>
            )
    }
}

export default MediaPreview