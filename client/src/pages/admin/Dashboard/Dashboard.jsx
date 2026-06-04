import { useState, useEffect } from 'react';
import './Dashboard.css';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import { ShowLoading, HideLoading } from '../../../redux/loaderSlice';
import dayjs from "dayjs";
import Filters from './components/Filters/Filters';
import TurnoverGraph from './components/TurnoverChart/TurnoverChart';
import CounterCard from './components/CounterCard/CounterCard';
import CLVSpeedometer from './components/CLVSpeedometer/CLVSpeedometer';
import GrowthRateChart from './components/GrowthRateChart/GrowthRateChart';
import subscriptionService from '../../../services/subscriptionService';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const currentYear = dayjs().year();
    const [selectedYear, setSelectedYear] = useState(currentYear.toString());
    const [selectedView, setSelectedView] = useState('monthly');
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            dispatch(ShowLoading());
            const query = {
                year: selectedYear,
                view: selectedView
            };
            try {
                const response = await subscriptionService.getDashboardData(query);
                if (response.data) {
                    console.log(response.data);
                    setData(response.data);
                }
            } catch (error) {
                message.error(error.response.data.error);
            } finally {
                dispatch(HideLoading());
            }
        };

        fetchData();
    }, [selectedYear, selectedView]);

    return (
        <div className='dashboard'>
            <div className='top-bar'>
                <div className='title'>Dashboard</div>
                <Filters selectedYear={selectedYear} setSelectedYear={setSelectedYear} selectedView={selectedView} setSelectedView={setSelectedView} />
            </div>
            {data &&
                <>
                    <TurnoverGraph data={data.turnover} />
                    <div className='bottom-div'>
                        <GrowthRateChart data={data.growthRate} selectedView={selectedView} />
                        <CLVSpeedometer title={"Customer Lifetime Value"} value={data.averageCLV} unit={"DKK"} min={0} max={5000} />
                        <CLVSpeedometer title={"Customer Lifetime"} value={data.averageLifetime} unit={"Months"} min={0} max={12} />
                    </div>
                    <div className='counter-card-container'>
                        <CounterCard value={data.activeMembersCount} description="Active members (on average)" query='active' />
                        <CounterCard value={data.newMembersCount} description="New members" query='new' />
                        <CounterCard value={data.lostMembersCount} description="Lost members" query='lost' />
                    </div>
                </>
            }
        </div>
    )
};

export default Dashboard;