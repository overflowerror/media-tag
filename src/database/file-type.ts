enum MediaFileType {
    unknown,
    video,
    image
}

function FileTypeFromExtension(name: string): MediaFileType {
    while (name.indexOf(".") >= 0) {
        name = name.substring(name.indexOf(".") + 1)
    }
    name = name.toLowerCase()
    switch (name) {
        case "jpeg":
        case "jpg":
        case "gif":
        case "png":
        case "webp":
            return MediaFileType.image
        case "mp4":
        case "avi":
        case "mpeg":
        case "mpeg2":
        case "m4v":
        case "mkv":
        case "mov":
        case "webv":
            return MediaFileType.video
        default:
            return MediaFileType.unknown
    }
}