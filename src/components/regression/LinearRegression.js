import { useState, useEffect } from "react";
import { lusolve } from "mathjs";
import { Line } from "react-chartjs-2";
import './styleRegression.css';
function LinearRegression() {
  const [X1target, setX1target] = useState(0);
  const [result, setResult] = useState(0);
  const [regressionEquation, setRegressionEquation] = useState("");
  const [pointCount, setPointCount] = useState(2);
  const [points, setPoints] = useState([{ x: "", y: "" }, { x: "", y: "" }]);
  const [plotData, setPlotData] = useState([]);
  const [calculated, setCalculated] = useState(false)
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/Regression');
        const result = await res.json();

        //เช็คว่า type เหมือนกันไหม
        const filteredResult = result.filter(item => item.methodType === "LinearRegression");
        setData(filteredResult);

        console.log(filteredResult);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);



  const PostDataBase = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:4000/api/Add-Regression', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        methodType: "LinearRegression",
        result,
        regressionEquation,
        points,
        plotData,
        X1target,
      }),
    });

    const dbResult = await response.json();
    console.log('Response Status:', response.status);
    console.log('Result from API:', dbResult);

    if (!response.ok) {
      console.error('Failed to save equation:', dbResult.message);
      alert("Fail")
      return;
    }
    alert("Success")
  }


  const Calculate = (e) => {
    e.preventDefault();
    const n = points.length;
    const matrix1 = Array(2).fill(0).map(() => Array(2).fill(0));
    const matrix2 = Array(2).fill(0);

    matrix1[0][0] = n;
    let sumX1 = 0;
    let sumX1Squared = 0;
    let sumY = 0;
    let sumX1Y = 0;

    points.forEach((point) => {
      const x1 = parseFloat(point.x) || 0;
      const y = parseFloat(point.y) || 0;
      sumX1 += x1;
      sumX1Squared += x1 * x1;
      sumY += y;
      sumX1Y += x1 * y;
    });

    matrix1[0][1] = matrix1[1][0] = sumX1;
    matrix1[1][1] = sumX1Squared;
    matrix2[0] = sumY;
    matrix2[1] = sumX1Y;

    const coefficients = lusolve(matrix1, matrix2);
    const intercept = coefficients[0][0];
    const slope = coefficients[1][0];

    setRegressionEquation(`Y = ${intercept.toFixed(4)} + ${slope.toFixed(4)}*X1`);

    const predictedY = intercept + slope * X1target;
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
      return { x, y: intercept + slope * x };
    });
    setPlotData(regressionLine);
    setCalculated(true);
  };


  const ResetNew = () => {
    setResult(0);
    setRegressionEquation("");
    setPointCount(2);
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

  const handleOptionChangeFunc = async (e) => {
    const selectedEquation = e.target.value;
    const selected = data.find(item => item.regressionEquation === selectedEquation);

    if (selected) {
        setX1target(selected.X1target); 
        setPoints(selected.points); 
        setResult(selected.result); 
        setPointCount(selected.points.length); 
        setRegressionEquation(selected.regressionEquation);
        setPlotData(selected.plotData)
        setCalculated(true)
    } else {
        console.error("Selected equation not found in data.");
    }
};


  return (
    <div className="calculator-container">
      <div className="form-container">
        <div className="form-title">
          <h1>Linear Regression</h1>
        </div>
        <form>
          <div className="inputPoint">
            <input type="number" step="any" value={pointCount} placeholder="Input number of points" onChange={handlePointCountChange} />
          </div>
        </form>

        <form onSubmit={Calculate}>
          <div className="formcontainer">
            <div>
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
            </div>
            <input type="number" step="any" value={X1target} placeholder="Input X1" onChange={handleX1target} />
            <select onChange={handleOptionChangeFunc} className="option-form">
              <option value="">Equation example</option>
              {data.map((item) => (
                <option key={item.id} value={item.regressionEquation}>
                  {`Answer: ${item.regressionEquation}`}
                </option>
              ))}
            </select>
            <div className="button-container">
              <button type="submit" className="calculate">Calculate</button>
              <button type="button" className="calculate" onClick={ResetNew}>Reset</button>
              <button type="button" className="calculate" onClick={PostDataBase}>Add Database</button>
            </div>
          </div>
          <div className="answer">
            <h1>Predicted Value: {result.toFixed(6)}</h1>
            <h2>Regression Equation: {regressionEquation}</h2>
          </div>
        </form>
      </div>
      {calculated && (
      <div className="chart-container" >
        <div>
          <Line data={chartData} options={options} />   
        </div>     
      </div>
      )}
    </div>
  );
}

export default LinearRegression;
