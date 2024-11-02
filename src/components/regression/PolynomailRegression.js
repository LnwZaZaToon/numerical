import { useState } from "react";
import { lusolve } from "mathjs";
import { Line } from "react-chartjs-2";

function PolynomialRegression() {
  const [X1target, setX1target] = useState(0);
  const [result, setResult] = useState(0);
  const [regressionEquation, setRegressionEquation] = useState("");
  const [pointCount, setPointCount] = useState(2);
  const [degree, setDegree] = useState(2);
  const [points, setPoints] = useState([{ x: "", y: "" }, { x: "", y: "" }]);
  const [plotData, setPlotData] = useState([]);
  const [calculated, setCalculated] = useState(false);

  const calculate = (e) => {
    e.preventDefault();
    if (points.length < degree + 1) {
      alert("Degree cannot be higher than points - 1");
      return;
    }
  
    // Matrix creation and solving logic remains the same
    const matrix1 = Array(degree + 1).fill(0).map(() => Array(degree + 1).fill(0));
    const matrix2 = Array(degree + 1).fill(0);
  
    points.forEach((point) => {
      const x1 = parseFloat(point.x) || 0;
      const y = parseFloat(point.y) || 0;
      for (let i = 0; i <= degree; i++) {
        for (let j = 0; j <= degree; j++) {
          matrix1[i][j] += x1 ** (i + j);
        }
        matrix2[i] += y * x1 ** i;
      }
    });
  
    const coefficients = lusolve(matrix1, matrix2).map((row) => row[0]);
    setRegressionEquation(
      "Y = " +
        coefficients
          .map((coeff, i) => `${coeff.toFixed(4)}*X1^${i}`)
          .join(" + ")
    );
  
    const predictedY = coefficients.reduce(
      (acc, coeff, i) => acc + coeff * X1target ** i,
      0
    );
    setResult(predictedY);
  
    // Find min and max x values from points
    const minX = Math.min(...points.map((p) => parseFloat(p.x) || 0));
    const maxX = Math.max(...points.map((p) => parseFloat(p.x) || 0));
    
    // Extend the range slightly
    const extendedMinX = minX - (maxX - minX) * 0.1;
    const extendedMaxX = maxX + (maxX - minX) * 0.1;
  
    // Generate regression line over the extended range
    const regressionLine = Array.from({ length: 100 }, (_, i) => {
      const x = extendedMinX + i * ((extendedMaxX - extendedMinX) / 99);
      const y = coefficients.reduce((acc, coeff, j) => acc + coeff * x ** j, 0);
      return { x, y };
    });
    setPlotData(regressionLine);
    setCalculated(true);
  };
  
  const reset = () => {
    setResult(0);
    setRegressionEquation("");
    setPointCount(2);
    setDegree(2);
    setPoints([{ x: "", y: "" }, { x: "", y: "" }]);
    setPlotData([]);
    setCalculated(false)
  };

  const handlePointCountChange = (e) => {
    const count = parseInt(e.target.value) || 2;
    setPointCount(count);
    const newPoints = Array.from({ length: count }, () => ({ x: "", y: "" }));
    setPoints(newPoints);
  };

  const handlePointChange = (index, axis, value) => {
    const updatedPoints = [...points];
    updatedPoints[index] = { ...updatedPoints[index], [axis]: value };
    setPoints(updatedPoints);
  };

  const handleDegreeChange = (e) => {
    const newDegree = parseInt(e.target.value) || 2;
    setDegree(newDegree);
  };

  const handleX1target = (e) => {
    setX1target(parseFloat(e.target.value) || 0);
  };

  const chartData = {
    datasets: [
      {
        label: 'Regression Line',
        data: plotData.map((point) => ({ x: point.x, y: point.y })),
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: false,
        showLine: true,
      },
      {
        label: 'Data Points',
        data: points.map((point) => ({ x: parseFloat(point.x) || 0, y: parseFloat(point.y) || 0 })),
        backgroundColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        pointRadius: 4,
      }
    ]
  };

  const options = {
    scales: {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: 'X1'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Y'
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Polynomial Regression Plot'
      },
      legend: {
        display: true,
        position: 'top'
      }
    }
  };

  return (
    <div className="calculator-container">
      <div className="form-container">
        <h1>Polynomial Regression</h1>
        <form>
          <div className="input-controls">
            <input type="number" placeholder="Number of points" onChange={handlePointCountChange} />
            <input type="number" placeholder="m"  onChange={handleDegreeChange} />
          </div>
        </form>

        <form onSubmit={calculate}>
          <div className="formcontainer">
            {points.map((point, index) => (
              <div key={index} className="pointInputs" style={{ display: 'flex' }}>
                <input
                  type="number"
                  value={point.x}
                  step="any"
                  placeholder={`X1${index + 1}`}
                  onChange={(e) => handlePointChange(index, "x", e.target.value)}
                />
                <input
                  type="number"
                  value={point.y}
                  step="any"
                  placeholder={`Y${index + 1}`}
                  onChange={(e) => handlePointChange(index, "y", e.target.value)}
                />
              </div>
            ))}
            <input type="number"  step="any" placeholder="Input X1" onChange={handleX1target} />

            <div className="button-container">
              <button type="submit" className="calculate">Calculate</button>
              <button type="button" className="calculate" onClick={reset}>Reset</button>
            </div>
          </div>
          <div className="answer">
          <h1>Predicted Value: {result.toFixed(6)}</h1>
          <h2>Regression Equation: {regressionEquation}</h2>
          </div>
        </form>
      </div>

      <div className="table" >
        {calculated && (
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
}

export default PolynomialRegression;