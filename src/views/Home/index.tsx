import React, {FunctionComponent, useEffect, useState} from "react";
import Sidebar from "../../components/Sidebar";
import MediaList from "../../components/MediaList";
import {MediaFile} from "../../database/file";
import {Query} from "../../database/query";
import {Database} from "../../database/database";
import MediaDetails from "../../components/MediaDetails";
import Repository from "../../repository";
import {ipcRenderer} from "electron";

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
                repo.get()
                    .then(d => {
                        setMessage(null)
                        setDatabase(d)
                    })
                    .catch(e => {
                        setMessage(e)
                    })
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
    }

    return (
        <div>
            { message &&
                <div className="message">
                    {message}
                </div>
            }
            { !message &&
                <>
                    <Sidebar countedTags={query.countedTags()} />
                    { selected &&
                        <>
                            <button onClick={() => setSelected(null)}>Back</button>
                            <MediaDetails basePath={repository.getPath()} file={selected} onUpdate={mediaUpdate} />
                        </>
                    }
                    { !selected &&
                        <MediaList basePath={repository.getPath()} files={query.get()} onSelect={setSelected} />
                    }
                </>
            }
        </div>
    )
}

export default Home