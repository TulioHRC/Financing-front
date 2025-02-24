import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export type BarChartData = {
  name: string;
  value: number;
}[];

const templateData : BarChartData = [
  { name: "Category A", value: 400 },
  { name: "Category B", value: 300 },
  { name: "Category C", value: 200 },
  { name: "Category D", value: 100 },
];

const BarChartComponent = ({
  title = "Default Title",
  data = templateData,
} : {title?: string, data?: BarChartData}) => {
  return (
    <div style={{ textAlign: "center" }}>
      <h2>{title}</h2>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default BarChartComponent;