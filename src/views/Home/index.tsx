import React, {FunctionComponent, useEffect, useState} from "react";
import Sidebar from "../../components/Sidebar";
import MediaList from "../../components/MediaList";
import {MediaFile} from "../../database/file";
import {Query} from "../../database/query";
import {Database} from "../../database/database";
import MediaDetails from "../../components/MediaDetails";
import Repository from "../../repository";
import {ipcRenderer} from "electron";
import MediaPreview from "../../components/MediaPreview";

const OPEN_REPOSITORY_MESSAGE_NAME = "MSG_OPEN_REPO"

export type HomeProps = {
}

function queryFilter(query: Query, tags: string[]): Query {
    tags.forEach(t => {
        query = query.has(t)
    })
    return query
}

const emptyQuery = new Query([])

const Home: FunctionComponent<HomeProps> = () => {
    const [tags, setTags] = useState<string[]>([])
    const [selected, setSelected] = useState<MediaFile|null>(null)

    const [repository, setRepository] = useState<Repository|null>(null)
    const [database, setDatabase] = useState<Database|null>(null)

    const [untagged, setUntagged] = useState<string[]>([])
    const [showUntagged, setShowUntagged] = useState<boolean>(false)

    const [message, setMessage] = useState<string|null>("No repository selected")

    useEffect(() => {
        const listener = (event: any, data: any) => {
            console.log(data)
            const _path = data as string
            if (_path) {
                const repo = new Repository(_path)
                setRepository(repo)

                setMessage("Loading...")
                setDatabase(null)
                setUntagged([])
                repo.get()
                    .then(d => {
                        setMessage(null)
                        setDatabase(d)
                    })
                    .catch(e => {
                        setMessage(e)
                    })
                repo.findUntagged().then(setUntagged)
            } else {
                setMessage("no repository selected")
                setRepository(null)
            }
        }

        ipcRenderer.on(OPEN_REPOSITORY_MESSAGE_NAME, listener)
        return () => {
            // cleanup
            ipcRenderer.removeListener(OPEN_REPOSITORY_MESSAGE_NAME, listener)
        }
    }, [setRepository])

    const query = database ? queryFilter(database.query(), tags) : emptyQuery
    const allTags = database ? database.query().tags() : []

    const mediaUpdate = (updatedFile: MediaFile) => {
        const dbClone = database.clone() // not a deep copy
        dbClone.updateFile(updatedFile)

        const repoClone = repository.update(dbClone)
        setMessage("Saving...")

        repoClone.write().then(() => {
            setRepository(repoClone)
            setDatabase(dbClone)
            setSelected(updatedFile)
            setMessage(null)
        })

        repoClone.findUntagged().then(setUntagged)
    }

    const basePath = repository ? repository.getPath() : ""

    return (
        <div>
            { message &&
                <div className="message">
                    {message}
                </div>
            }
            { !message &&
                <>
                    <Sidebar
                        countedTags={query.countedTags()}
                        selected={tags}
                        onSelect={(tag) => {
                            const i = tags.indexOf(tag)
                            const _tags = [...tags]
                            if (i < 0) {
                                _tags.push(tag)
                            } else {
                                _tags.splice(i, 1)
                            }
                            setTags(_tags)
                        }}
                    />
                    { selected &&
                        <>
                            <button onClick={() => setSelected(null)}>Back</button>
                            <MediaDetails basePath={basePath} file={selected} onUpdate={mediaUpdate} />
                        </>
                    }
                    { !selected && showUntagged &&
                        <>
                            <h1>Untagged</h1>
                            <button onClick={() => setShowUntagged(false)}>Back</button>
                            { untagged.map(u => new MediaFile(u)).map(u => (
                                <div
                                    onClick={() => {
                                    setSelected(u)
                                }}
                                    key={u.getPath()}
                                >
                                    <MediaPreview basePath={basePath} file={u} />
                                </div>
                            ))}
                        </>
                    }
                    { !selected && !showUntagged &&
                        <>
                            { untagged.length > 0 &&
                                <a
                                    onClick={() => setShowUntagged(true) }
                                >
                                    {untagged.length} untagged files
                                </a>
                            }
                            <MediaList basePath={basePath} query={query} onSelect={setSelected} />
                        </>
                    }
                </>
            }
        </div>
    )
}

export default Home