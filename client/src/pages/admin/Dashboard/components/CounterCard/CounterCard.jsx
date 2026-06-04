import './CounterCard.css';
import { Link } from 'react-router-dom';
import HeartIcon from '../../../../../assets/icons/heart.svg?react';

const CounterCard = ({ value, description, query }) => {
    return (
        <Link to={`/company/common/users?status=${query}`} className='counter-card'>
            <HeartIcon />
            <div className='text'>
                <div className='value'>{value}</div>
                <div className='description'>{description}</div>
            </div>
        </Link>
    )
};

export default CounterCard;