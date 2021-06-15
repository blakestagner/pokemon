import {useState, useEffect} from 'react';
import './details.scss';

export default function Type({types}) {
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        if(types) {
            setLoading(false)
        }
    }, [types])



    if(loading) {
        return (
            <p>Loading</p>
        )
    }

    return (
        <div className="type">
            {types.map((type, i) => (
                <p 
                    key={type.type.name}
                    className={type.type.name}>
                    {type.type.name}
                </p>
            ))}
        </div>
    )
}