import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

export type RadarChartData = {
  category: string;
  score: number;
}[];

interface RadarChartComponentProps {
  title?: string;
  data: RadarChartData;
  maxScore?: number;
}

const RadarChartComponent = ({
  title = "Default Title",
  data,
  maxScore = 5,
}: RadarChartComponentProps) => {
  return (
    <div style={{ textAlign: "center" }}>
      <h2>{title}</h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <RadarChart data={data} outerRadius={90}>
            <PolarGrid />
            <PolarAngleAxis dataKey="category" />
            <PolarRadiusAxis angle={30} domain={[0, maxScore]} />
            <Radar name="Score" dataKey="score" stroke="#4060E3" fill="#4060E3" fillOpacity={0.5} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RadarChartComponent;
