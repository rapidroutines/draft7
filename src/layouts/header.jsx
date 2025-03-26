import { ChevronsLeft } from "lucide-react";
import profileImg from "@/assets/user.png";
import PropTypes from "prop-types";

export const Header = ({ collapsed, setCollapsed }) => {
    return (
        <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md">
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronsLeft className={collapsed && "rotate-180"} />
                </button>
                {/* Search bar removed */}
            </div>
            <div className="flex items-center gap-x-3">
                <button className="size-10 overflow-hidden rounded-full">
                    <img
                        src={profileImg}
                        alt="profile image"
                        className="size-full object-cover"
                    />
                </button>
            </div>
        </header>
    );
};

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};