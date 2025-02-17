import { PieChart, Pie, Cell, Legend } from "recharts";

export type PieChartData = {
  name: string;
  value: number;
}[];

const templateData : PieChartData = [
  { name: "Category A", value: 1 },
  { name: "Category B", value: 300 },
  { name: "Category C", value: 200 },
  { name: "Category D", value: 100 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const PieChartComponent = ({
  title = "Default Title",
  data = templateData
} : {title?: string, data?: PieChartData}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const dataWithPercentage = data.map((item) => ({
    ...item,
    percentage: ((item.value / total) * 100).toFixed(1) + "%",
  }));

  return (
    <div style={{ textAlign: "center" }}>
      <h2>{ title }</h2>
      <PieChart width={400} height={300}>
        <Pie
          data={dataWithPercentage}
          cx={200}
          cy={150}
          innerRadius={20}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ percentage }) => percentage}
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </div>
  );
};

export default PieChartComponent;