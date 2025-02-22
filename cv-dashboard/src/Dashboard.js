import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import usericon from "./icon.png";

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/dashboard")  // Fetch from FastAPI
            .then(response => setDashboardData(response.data))
            .catch(error => console.error("Error fetching dashboard data:", error));
    }, []);

    if (!dashboardData) {
        return <p>Loading...</p>; // Show loading text until data loads
    }

    // Extracting data
    const barData = dashboardData.bar_chart;
    const totalCVs = dashboardData.total_cvs;
    const { AI, SE, QA, Other } = dashboardData.pie_chart;

    // Colors
    const colors = {
        AI: ['#f39c12', '#fdebd0'],
        SE: ['#2ecc71', '#d5f5e3'],
        QA: ['#3498db', '#d6eaf8'],
        Other: ['#9b59b6', '#ebdef0']
    };

    return (
        <div className="dashboard-container">
            <div className='dashboard-fullcard-outer'>
                <div className='dashboard-fullcard-inner'>
                    <h2 className='title'>Statistics</h2>
                    <div className="dashboard-content">

                        <div className="total-cvs-card">
                            <div className="card-info">
                                <img src={usericon} alt="User Icon" className="user-icon" />
                                <h3 className="card-title">Total CVs</h3>
                            </div>
                            <p className="card-value">{totalCVs}</p>
                        </div>

                        <div className="chart-container bar-chart">
                            <h3>CVs Over Months</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={barData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="AI" fill="#FF7777" />
                                    <Bar dataKey="SE" fill="#694BDB" />
                                    <Bar dataKey="QA" fill="#FFA800" />
                                    <Bar dataKey="Other" fill="#ff2e32" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="chart-container donut-chart">
                            <h3>Job Roles</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart width={300} height={300}>
                                    {Object.entries({ AI, SE, QA, Other }).map(([key, data], index) => (
                                        <Pie
                                            key={key}
                                            data={[
                                                { name: `${key}-filled`, value: data.filled },
                                                { name: `${key}-unfilled`, value: data.unfilled }
                                            ]}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40 + index * 15}
                                            outerRadius={50 + index * 15}
                                            startAngle={90}
                                            endAngle={-270}
                                        >
                                            <Cell fill={colors[key][0]} />
                                            <Cell fill={colors[key][1]} />
                                        </Pie>
                                    ))}
                                </PieChart>

                                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
                                    {Object.entries({ AI, SE, QA, Other }).map(([key, data]) => (
                                        <div key={key}>
                                            <div style={{ width: '12px', height: '12px', backgroundColor: colors[key][0], display: 'inline-block', marginRight: '5px' }} />
                                            <span>{key}: {data.filled}%</span>
                                        </div>
                                    ))}
                                </div>

                            </ResponsiveContainer>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
