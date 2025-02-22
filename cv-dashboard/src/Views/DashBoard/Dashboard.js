import React from 'react';
import './Dashboard.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import usericon from "../../Resources/icon.png"

const Dashboard = () => {
    const barData = [

        { name: 'Jan', AI: 20, SE: 40, QA: 10, Other: 5 },
        { name: 'Feb', AI: 25, SE: 35, QA: 15, Other: 2 },
        { name: 'Mar', AI: 30, SE: 30, QA: 20, Other: 15 },
        { name: 'Apr', AI: 40, SE: 20, QA: 25, Other: 25 },
        { name: 'May', AI: 50, SE: 10, QA: 30, Other: 5 },
    ];
    const aiData = [
        { name: 'AI-filled', value: 55 }, { name: 'AI-unfilled', value: 45 },
    ];
    const seData = [{ name: 'SE-filled', value: 45 }, { name: 'SE-unfilled', value: 55 },];

    const qaData = [
        { name: 'QA-filled', value: 65 }, { name: 'QA-unfilled', value: 35 },];

    const otherData = [
        { name: 'Other-filled', value: 25 }, { name: 'Other-unfilled', value: 75 },
    ];

    // Colors for each ring
    const colorAIFilled = '#f39c12';
    const colorAIUnfilled = '#fdebd0';

    const colorSEFilled = '#2ecc71';
    const colorSEUnfilled = '#d5f5e3';

    const colorQAFilled = '#3498db';
    const colorQAUnfilled = '#d6eaf8';

    const colorOtherFilled = '#9b59b6';
    const colorOtherUnfilled = '#ebdef0';

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
                            <p className="card-value">542</p>
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
                                    <Pie
                                        data={aiData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={50}
                                        startAngle={90}
                                        endAngle={-270}
                                    >

                                        <Cell fill={colorAIFilled} />
                                        <Cell fill={colorAIUnfilled} />
                                    </Pie>

                                    <Pie
                                        data={seData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={65}
                                        startAngle={90}
                                        endAngle={-270}
                                    >
                                        <Cell fill={colorSEFilled} />
                                        <Cell fill={colorSEUnfilled} />
                                    </Pie>

                                    <Pie
                                        data={qaData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={80}
                                        startAngle={90}
                                        endAngle={-270}
                                    >
                                        <Cell fill={colorQAFilled} />
                                        <Cell fill={colorQAUnfilled} />
                                    </Pie>

                                    <Pie
                                        data={otherData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={85}
                                        outerRadius={95}
                                        startAngle={90}
                                        endAngle={-270}
                                    >
                                        <Cell fill={colorOtherFilled} />
                                        <Cell fill={colorOtherUnfilled} />
                                    </Pie>


                                </PieChart>

                                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
                                    <div>
                                        <div style={{ width: '12px', height: '12px', backgroundColor: colorAIFilled, display: 'inline-block', marginRight: '5px' }} />
                                        <span>AI: 55%</span>
                                    </div>
                                    <div>
                                        <div style={{ width: '12px', height: '12px', backgroundColor: colorSEFilled, display: 'inline-block', marginRight: '5px' }} />
                                        <span>SE: 45%</span>
                                    </div>
                                    <div>
                                        <div style={{ width: '12px', height: '12px', backgroundColor: colorQAFilled, display: 'inline-block', marginRight: '5px' }} />
                                        <span>QA: 65%</span>
                                    </div>
                                    <div>
                                        <div style={{ width: '12px', height: '12px', backgroundColor: colorOtherFilled, display: 'inline-block', marginRight: '5px' }} />
                                        <span>Other: 25%</span>
                                    </div>
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
