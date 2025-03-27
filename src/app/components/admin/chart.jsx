"use client"

import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const Charts = () => {
  const weeklySalesOptions = {
    chart: {
      type: 'area',
      height: 350,
      zoom: { enabled: false },
      toolbar: { show: false }
    },
    colors: ['#10B981'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3 }
    },
    xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    tooltip: { y: { formatter: (val) => "Rs. " + val } }
  };

  const weeklySalesSeries = [{ name: 'Sales', data: [12000, 19000, 15000, 25000, 22000, 30000, 28000] }];

  const orderStatusOptions = {
    chart: { type: 'donut' },
    colors: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'],
    labels: ['Delivered', 'In Transit', 'Processing', 'Pending'],
    legend: { position: 'bottom' },
    plotOptions: { pie: { donut: { size: '65%' } } },
    responsive: [{
      breakpoint: 480,
      options: { chart: { width: 200 }, legend: { position: 'bottom' } }
    }]
  };

  const orderStatusSeries = [35, 15, 10, 5];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-gray-800 font-medium mb-4">Weekly Sales</h3>
        <Chart options={weeklySalesOptions} series={weeklySalesSeries} type="area" height={350} />
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-gray-800 font-medium mb-4">Order Status</h3>
        <Chart options={orderStatusOptions} series={orderStatusSeries} type="donut" height={350} />
      </div>
    </div>
  );
};

export default Charts;