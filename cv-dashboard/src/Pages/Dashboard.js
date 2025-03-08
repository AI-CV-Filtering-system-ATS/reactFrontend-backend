import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import usericon from "../Images/icon.png";
import Background from "../Components/Background";  


const Dashboard = () => {
    const [totalCVs, setTotalCVs] = useState(0);
    const [chartData, setChartData] = useState([]);
    const [barChartData, setBarChartData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/Pavithra/api/job_roles')
        .then((response) => {
                const formattedData = Object.keys(response.data).map(role => ({
                    name: role,
                    value: response.data[role]
                }));
                setChartData(formattedData);
            })
            .catch((error) => console.error("Error fetching job roles data:", error));

        axios.get("http://localhost:8000/Pavithra/api/dashboard")
            .then((response) => setTotalCVs(response.data.total_cvs))
            .catch((error) => console.error("Error fetching total CVs data:", error));

        axios.get("http://localhost:8000/Pavithra/api/job_roles/counts")
            .then((response) => {
                const formattedBarChartData = Object.keys(response.data).map(role => ({
                    name: role,
                    count: response.data[role]
                }));
                setBarChartData(formattedBarChartData);
            })
            .catch((error) => console.error("Error fetching job roles counts data:", error));

    }, []);

    if (!chartData.length || !barChartData.length) return <p>Loading...</p>;

    const colors = [
        "rgb(255, 94, 77)",     
        "rgb(138, 45, 158)",    
        "rgb(42, 82, 199)",     
        "rgb(17, 210, 255)",    
        "rgb(240, 178, 66)",    
        "rgb(84, 195, 112)",    
        "rgb(216, 35, 115)",    
        "rgb(51, 133, 255)",   
        "rgb(73, 183, 58)",    
        "rgb(255, 153, 51)"    
    ];
    
    return (
        <div className="dashboard-container">
            <div className="dashboard-fullcard-outer">
                <div className="dashboard-fullcard-inner">
                    <h2 className="title">Statistics</h2>
                    <div className="dashboard-content">

                        {/* Total CVs Card */}
                        <div className="total-cvs-card">
                            <div className="card-info">
                                <img src={usericon} alt="User Icon" className="user-icon" />
                                <h3 className="card-title">Total CVs</h3>
                            </div>
                            <p className="card-value">{totalCVs}</p>
                        </div>

                        {/* Pie Chart - Job Roles */}
                        <div className="pie-chart-container">
                            <div className="chart-container pie-chart">
                                <h3 className='pie-title'>Job Roles</h3>
                                <ResponsiveContainer width="100%" height={400}>
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            dataKey="value"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            innerRadius={50}
                                            startAngle={180}
                                            endAngle={-180}
                                            label={({ value }) => ` ${value.toFixed(2)}%`}
                                            stroke="#fff"
                                            strokeWidth={0}
                                            labelLine={false}
                                            isAnimationActive={true}
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell
                                                    key={index}
                                                    fill={colors[index % colors.length]}
                                                    style={{
                                                        filter: 'drop-shadow(5px 0px 7px rgba(0, 0, 0, 0.8))',
                                                    }}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => `${value.toFixed(2)}%`}
                                            contentStyle={{
                                                backgroundColor: '#1e3d58',
                                                borderRadius: '5px',
                                                padding: '8px',
                                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
                                            }}
                                            itemStyle={{
                                                color: 'rgb(255, 255, 255)',   
                                                fontFamily: 'Arial, sans-serif',
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                            }}
                                        />

                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Horizontal Bar Chart - Job Role Distribution */}
                        <div className="chart-container bar-chart">
                            <h3>Job Role Distribution</h3>
                            <div className="barchart">
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={barChartData} layout="vertical">
                                        <defs>
                                            <linearGradient id="gradientColor" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#3a0ca3" stopOpacity="1" />
                                                <stop offset="40%" stopColor="#4a70b1" stopOpacity="1" />
                                                <stop offset="80%" stopColor="#6a8ff5" stopOpacity="1" />
                                                <stop offset="100%" stopColor="#00c9ff" stopOpacity="1" />
                                            </linearGradient>

                                        </defs>

                                        <XAxis type="number" />
                                        <YAxis
                                            type="category"
                                            dataKey="name"
                                            width={150}  
                                            tickFormatter={(value) => {
                                                const words = value.split(" ");
                                                return words.length > 2 ? `${words[0]} ${words[1]}\n${words.slice(2).join(" ")}` : value;
                                            }}
                                            tick={{ fontSize: 10 }}  
                                        />
                                        <Tooltip
                                            
                                            contentStyle={{
                                                backgroundColor: '#1e3d58',
                                                borderRadius: '5px',
                                                padding: '8px',
                                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
                                            }}
                                            itemStyle={{
                                                color: 'rgb(255, 255, 255)',   
                                                fontFamily: 'Arial, sans-serif',
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                            }}
                                        />
                                        <Bar dataKey="count" fill="url(#gradientColor)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
