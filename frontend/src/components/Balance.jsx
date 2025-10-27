import PropTypes from 'prop-types';

export const Balance = ({ value }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-sm font-medium text-gray-500">
                Your Balance
            </div>
            <div className="mt-1 text-3xl font-bold text-gray-800">
                {typeof value === 'number' ? formatCurrency(value) : value}
            </div>
        </div>
    );
};

Balance.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired
};