// Types for Plotly integration
export interface PlotlyConfig {
  displayModeBar: boolean;
  responsive: boolean;
}

export interface PlotlyData {
  x: (string | number)[];
  y: (string | number)[];
  type: string;
  mode?: string;
  name?: string;
  line?: {
    color: string;
    width: number;
  };
}

export interface PlotlyLayout {
  title: string;
  xaxis: {
    title: string;
  };
  yaxis: {
    title: string;
  };
  plot_bgcolor: string;
  paper_bgcolor: string;
}