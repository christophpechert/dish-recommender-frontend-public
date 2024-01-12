import { useEffect, useState } from "react"

function SearchBar<T extends object, K extends keyof T>(props: {keyName: K, values: T[], setValues: (values: T[]) => void }) {
    const [searchWord, setSearchWord] = useState<string>("");
    const [searchActive, setSearchActive] = useState<boolean>(false);
    const [values, setValues] = useState<T[]>([]);

    useEffect(() => {
        setSearchActive(false);
    }, [])

    const handleSearch = () => {
        const newSearchWord = searchWord.trim().toLowerCase();

        if (!searchActive && newSearchWord.length > 0) {
            setValues(props.values);

            const newValues = props.values.filter((e) => {
                const property = props.keyName;
                if ( property in e) {
                    const propertyValue = e[property];
                    if (typeof propertyValue === "string") {
                        return propertyValue.toLowerCase().includes(newSearchWord);
                    }
                    return false;
                }
                return false;
            });
            props.setValues([...newValues]);
            setSearchActive(true)
        }
    }

    const handleResetSearch = () => {
        setSearchWord("");
        if (searchActive) {
            props.setValues([...values]);
            setSearchActive(false)
        }
    }

    return (
        <div className="d-flex justify-content-center mb-3">
            <div className="input-group" style={{ width: "90%" }}>
                <input type="text" className="form-control" placeholder="" value={searchWord} onChange={e => setSearchWord(e.target.value)} disabled={searchActive} />
                <button className="btn btn-outline-secondary" type="button" onClick={handleSearch} disabled={searchActive}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                </button>
                <button className="btn btn-outline-secondary" type="button" onClick={handleResetSearch}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>
    )
}

export default SearchBar