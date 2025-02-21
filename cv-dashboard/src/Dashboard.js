import React from 'react';
import './Dashboard.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
 
const Dashboard = () => {
    const barData = [
        
        { name: 'Jan', AI: 20, SE: 40, QA: 10 },
        { name: 'Feb', AI: 25, SE: 35, QA: 15 },
        { name: 'Mar', AI: 30, SE: 30, QA: 20 },
        { name: 'Apr', AI: 40, SE: 20, QA: 25 },
        { name: 'May', AI: 50, SE: 10, QA: 30 },
    ];

    // For the multi-ring chart, define separate data sets for each ring.
    const aiData = [
        { name: 'AI-filled', value: 55 },
        { name: 'AI-unfilled', value: 45 },
    ];

    const seData = [
        { name: 'SE-filled', value: 45 },
        { name: 'SE-unfilled', value: 55 },
    ];

    const qaData = [
        { name: 'QA-filled', value: 65 },
        { name: 'QA-unfilled', value: 35 },
    ];

    const otherData = [
        { name: 'Other-filled', value: 25 },
        { name: 'Other-unfilled', value: 75 },
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
            <div className="dashboard-content">
                {/* Top Card: Total CVs */}
                <div className="total-cvs-card">
                    <h3 className="card-title">Total CVs</h3>
                    <p className="card-value">89,935</p>
                </div>

                {/* Bottom-left: Bar Chart */}
                <div className="chart-container bar-chart">
                    <h3>CVs Over Months</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={barData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="AI" fill="#8884d8" />
                            <Bar dataKey="SE" fill="#82ca9d" />
                            <Bar dataKey="QA" fill="#ffc658" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Bottom-right: Multi-Ring Donut Chart */}
                <div className="chart-container donut-chart">
                    <h3>Job Roles</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart width={300} height={300}>
                            {/* Ring 1: AI (two slices) */}
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
                                {/* We map each data object to a Cell. 
            The first object is filled, second is unfilled. */}
                                <Cell fill={colorAIFilled} />
                                <Cell fill={colorAIUnfilled} />
                            </Pie>

                            {/* Ring 2: SE (two slices) */}
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

                            {/* Ring 3: QA (two slices) */}
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

                            {/* Ring 4: Other (two slices) */}
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
                        
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
