import React, {FunctionComponent, useState} from "react";

export type AutocompleteProps = {
    value: string,
    options: string[],
    onChange: (value: string) => void
}

const Autocomplete: FunctionComponent<AutocompleteProps> = ({value, options, onChange}) => {
    const matchingOptions = options.filter(o => o.toLowerCase().indexOf(value.toLowerCase()) >= 0)
    const [showSuggestion, setShowSuggestion] = useState<boolean>(false)

    const [selectedIndex, setSelectedIndex] = useState<number|null>(null)

    const onSelect = (value: string) => {
        setShowSuggestion(false)
        setSelectedIndex(null)
        onChange(value)
    }

    return (
        <>
            <input
                value={value}
                onKeyDown={event => {
                    if (event.key == "ArrowDown") {
                        setSelectedIndex(Math.min(selectedIndex + 1, matchingOptions.length - 1))
                    } else if (event.key == "ArrowUp") {
                        setSelectedIndex(Math.max(0, selectedIndex - 1))
                    }
                    if (event.key == "Enter" && selectedIndex !== null) {
                        onSelect(matchingOptions[selectedIndex])
                    }
                }}
                onChange={event => {
                    setShowSuggestion(true)
                    setSelectedIndex(null)
                    onChange(event.target.value)
                }}
            />
            { showSuggestion && matchingOptions.length > 0 && matchingOptions[0] != value &&
                <ul>
                    { matchingOptions.map((o, i) => (
                        <li
                            key={o}
                            onClick={() => {
                                onSelect(matchingOptions[i])
                            }}
                        >
                            {i === selectedIndex && "#"} {o}
                        </li>
                    ))}
                </ul>
            }
        </>
    )
}

export default Autocomplete