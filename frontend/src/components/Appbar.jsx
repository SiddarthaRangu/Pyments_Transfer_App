import PropTypes from 'prop-types';

export const Appbar = ({ userName }) => {
    const userInitial = userName ? userName[0].toUpperCase() : 'U';

    return (
        <div className="shadow h-14 flex justify-between items-center px-4">
            <div className="flex flex-col justify-center h-full font-bold text-xl">
                Payments App
            </div>
            <div className="flex items-center">
                <div className="flex flex-col justify-center h-full mr-4">
                    Hello, {userName || 'User'}
                </div>
                <div className="rounded-full h-10 w-10 bg-slate-200 flex justify-center items-center">
                    <div className="text-xl">
                        {userInitial}
                    </div>
                </div>
            </div>
        </div>
    );
};

Appbar.propTypes = {
    userName: PropTypes.string.isRequired
};