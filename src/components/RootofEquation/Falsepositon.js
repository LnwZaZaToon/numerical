import { useState } from "react";
import './bisection.css';
import { evaluate } from 'mathjs';
import { Chart as ChartJS } from "chart.js/auto";
import { Line } from "react-chartjs-2";

function Falseposition() {
  const [xL, setxL] = useState(2);
  const [xR, setxR] = useState(5);
  const [epsilon, setEpsilon] = useState(0.0001);
  const [func, setfunc] = useState("x^3.5-80");
  const [result, setResult] = useState(0);
  const [table, setTable] = useState([]);
  const [data, setData] = useState([]);
  const [calculated, setCalculated] = useState(false);

  const Calculate = (e) => {
    e.preventDefault()
    let xl = parseFloat(xL);
    let xr = parseFloat(xR);
    let eps = epsilon
    let xm = 0
    let xold = 0
    let error = 1, i = 0
    const Arraydata = []
    while (error > eps) {
      xold = xm
      if (F(xl) * F(xr) > 0) {
        break;
      }
      xm = Formula(xl, xr)
      if (xm === 0) {
        break;
      }
      else if (F(xm) * F(xr) > 0) {
        xr = xm
      }
      else if (F(xm) * F(xr) < 0) {
        xl = xm

      }

      if (i > 0) {
        error = Math.abs(xm - xold)
        if (error < eps) {
          break;
        }
      }
      Arraydata.push({ iteration: i + 1, xl, xm, xr });
      i++;

    }
    setResult(xm)
    setTable(Arraydata)
    setCalculated(true)

  }
  const Formula = (xl, xr) => {
    return (xl * F(xr) - xr * F(xl)) / (F(xr) - F(xl));
  }
  const F = (x) => {
    return evaluate(func, { x });
  }

  const inputXL = (e) => {
    console.log(e.target.value)
    setxL(e.target.value);
  }
  const inputXR = (e) => {
    console.log(e.target.value)
    setxR(e.target.value);
  }
  const inputEp = (e) => {
    console.log(e.target.value)
    setEpsilon(e.target.value);
  }
  const inputFunc = (e) => {
    console.log(e.target.value)
    setfunc(e.target.value);
  }
  const ResetNew = () => {
    setxL(2);
    setxR(5);
    setEpsilon(0.0001);
    setfunc("x^3.5-80");
    setResult(0);
    setTable([]);
  }

  const handleOptionChangeFunc = (e) => {
    setfunc(e.target.value);
  }

  return (
    <div className="calculator-container">
      <form onSubmit={Calculate}>
        <div className="form-container">
          <h1 className="form-title">False Position Method Calculator</h1>
          <div>
            <input type="text" value={func} step="any" id="func" placeholder="Input function" onChange={inputFunc} />
          </div>
          <div>
            <input type="number" value={xL} step="any" id="xl" placeholder="Input xl" onChange={inputXL} />
          </div>
          <div>
            <input type="number" value={xR} step="any" id="xr" placeholder="Input xr" onChange={inputXR} />
          </div>
          <div>
            <input type="number" value={epsilon} step="any" id="epsilon" placeholder="Input epsilon" onChange={inputEp} />
          </div>
          <select onChange={handleOptionChangeFunc} className="option-form">
            <option value={null}>Equation example</option>
            {data.map((data) => (
              <option key={data.id}>
                {`${data.equation}`}
              </option>
            ))}
          </select>
          <div className="button-container">
            <button type="submit" className="calculate">Calculate</button>
            <button type="button" className="calculate" onClick={ResetNew}>Reset</button>
          </div>
          <h1>Answer: {result.toFixed(6)}</h1>
        </div>
      </form>

      <div className="results-container">
        <div className="table-and-chart">
          {calculated && table.length > 0 && (
            <>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Iteration</th>
                    <th width="30%">XL</th>
                    <th width="30%">XM</th>
                    <th width="30%">XR</th>
                  </tr>
                </thead>
                <tbody>
                  {table.map((element, index) => (
                    <tr key={index}>
                      <td>{element.iteration}</td>
                      <td>{element.xl.toFixed(6)}</td>
                      <td>{element.xm.toFixed(6)}</td>
                      <td>{element.xr.toFixed(6)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="chart-container">
                <Line
                  data={{
                    labels: table.map((_, index) => (index + 1).toString()),
                    datasets: [
                      {
                        label: 'XM Values',
                        data: table.map((element) => element.xm),
                        borderColor: 'rgba(75,192,192,1)',
                        backgroundColor: 'rgba(75,192,192,0.2)',
                        fill: true,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );


}

export default Falseposition;


