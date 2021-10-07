import React, {FunctionComponent, useState} from "react";
import Sidebar from "../../components/Sidebar";
import MediaList from "../../components/MediaList";
import {MediaFile} from "../../database/file";

export type HomeProps = {
}

const Home: FunctionComponent<HomeProps> = () => {

    const [selected, setSelected] = useState<MediaFile|null>(null)

    return (
        <div>
            <Sidebar />
            { !selected &&
                <MediaList />
            }
        </div>
    )
}

export default Home