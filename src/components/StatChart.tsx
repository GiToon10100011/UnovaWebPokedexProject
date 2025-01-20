import { IPokemonDetail } from "./PokemonList";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import styled from "styled-components";
import { useParams } from "react-router-dom";

const Container = styled.div`
  #chart {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 320px;
    margin: auto;

    svg {
      overflow: visible;
      width: 100% !important;
      height: 100% !important;
    }
  }
  .apexcharts-xaxis-label {
    fill: #000 !important;
    font-size: 12px;
  }
  .apexcharts-radar-series line {
    opacity: 0.6;
    stroke: #000;
  }
  .apexcharts-radar-series polygon {
    opacity: 0.6;
    stroke: #000;
  }

  foreignObject {
    overflow: visible;
  }
`;

const StatChart = ({ stats }: { stats: IPokemonDetail["stats"] }) => {
  const { pokemonId } = useParams();
  // apexcharts는 배열로 라벨을 주면 줄바꿈으로 렌더링해줌
  const chartOptions: ApexOptions = {
    chart: {
      type: "radar",
      toolbar: {
        show: false,
      },
      width: "100%",
    },
    yaxis: {
      show: false,
    },
    xaxis: {
      categories: stats.map((stat) => `${stat.stat.name}: ${stat.base_stat}`),
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: "bold", 
        },
        formatter: function (value: any) {
          if (typeof value === "string") {
            const [name, stat] = value.split(": ");
            if (name.startsWith("special-")) {
              const [special, type] = name.split("-");
              return [
                special.charAt(0).toUpperCase() + special.slice(1),
                `${type.charAt(0).toUpperCase() + type.slice(1)}: ${stat}`,
              ];
            }
            return [`${name.charAt(0).toUpperCase() + name.slice(1)}: ${stat}`];
          }
          return value;
        },
      },
    },
    grid: {
      show: false,
    },
    markers: {
      size: 4,
    },
  };

  const series: ApexAxisChartSeries = [
    {
      name: `${pokemonId}'s stats`,
      data: stats.map((stat) => stat.base_stat),
    },
  ];
  return (
    <Container>
      <div id="chart">
        <Chart
          options={chartOptions}
          series={series}
          type="radar"
          width={250}
          height={250}
        />
      </div>
    </Container>
  );
};

export default StatChart;
