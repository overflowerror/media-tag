import React, {FunctionComponent} from "react";

export type PageControlProps = {
    current: number,
    max: number,
    onChange: (page: number) => void
}

const PageControl: FunctionComponent<PageControlProps> = ({current, max, onChange}) => {
    return (
        <div>
            <button
                onClick={() => onChange(current - 1)}
                disabled={current == 0}
            >
                Prev
            </button>
            page {current + 1} of {max + 1}
            <button
                onClick={() => onChange(current + 1)}
                disabled={current == max}
            >
                Next
            </button>
        </div>
    )
}

export default PageControl