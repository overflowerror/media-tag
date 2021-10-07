import React, {FunctionComponent, useContext, useEffect, useState} from "react";
import Repository from "../../repository";
import {ipcRenderer} from 'electron';

const OPEN_REPOSITORY_MESSAGE_NAME = "MSG_OPEN_REPO"

const RepositoryContext = React.createContext<Repository|null>(null)

export const useRepository = () => useContext(RepositoryContext)

type RepositoryProviderProps = {
}

const RepositoryProvider: FunctionComponent<RepositoryProviderProps> = ({children}) => {
    const [repository, setRepository] = useState<Repository|null>(null)

    useEffect(() => {
        const listener = (event: any, data: any) => {
            console.log(data)
            const _path = data as string
            if (_path) {
                setRepository(new Repository(_path))
            } else {
                setRepository(null)
            }
        }

        ipcRenderer.on(OPEN_REPOSITORY_MESSAGE_NAME, listener)
        return () => {
            // cleanup
            ipcRenderer.removeListener(OPEN_REPOSITORY_MESSAGE_NAME, listener)
        }
    }, [setRepository])

    return (
        <RepositoryContext.Provider value={repository}>
            {children}
        </RepositoryContext.Provider>
    )
}

export default RepositoryProvider