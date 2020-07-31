import React from "react";
const Navigation = ({ onRouteChange, isSignedIn }) => {
    return (
        <nav style={{ display: "flex", justifyContent: "flex-end" }}>
            {
                isSignedIn === true ? (
                    <div>
                        <a
                            onClick={() => onRouteChange("signin")}
                            href='#0'
                            className='f3 link dim black underline pa3 pointer'>
                            Sign Out
                        </a>
                    </div>
                ) : (
                        <div>
                            <a
                                onClick={() => onRouteChange("signin")}
                                href='#0'
                                className="f3 link dim black underline pa3 pointer">
                                Sign In
                                                        </a>
                            <a
                                onClick={() => onRouteChange("register")}
                                href='#0'
                                className="f3 link dim black underline pa3 pointer">
                                Register
                                                        </a>
                        </div>
                    )
            }


        </nav>

    )
}
export default Navigation;