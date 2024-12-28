import { useLocation } from "react-router-dom";

const NotFound = () => {

    const location = useLocation();

    return (
        <div>
            <h1>No route found for {location.pathname}</h1>
        </div>
    )
};

export { NotFound };