
import { useState, useEffect } from 'react'
import { evaluate } from 'mathjs';
var Algebrite = require('algebrite')

function Simpson() {
    const [Func, setFunc] = useState("x^7+2x^3-1");
    const [A, setA] = useState(-1);
    const [B, setB] = useState(2);
    const [resultTrap, setResultTrap] = useState(0);
    const [resultNormal, setResultNormal] = useState(0);
    const [Err, setErr] = useState(0);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:4000/api/Integral');
                const result = await res.json();

                const filteredResult = result.filter(item => item.methodType === "Simpson");
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
        const response = await fetch('http://localhost:4000/api/Add-Integral', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                methodType: "Simpson",
                equation: Func,
                a: parseFloat(A),
                b: parseFloat(B),
                n: 0,
                answer1: parseFloat(resultTrap),
                answer2: parseFloat(resultNormal),
                err: parseFloat(Err)
            }),
        });

        const dbResult = await response.json();
        console.log('Response Status:', response.status);
        console.log('Result from API:', dbResult);

        if (!response.ok) {
            console.error('Failed to save equation:', dbResult.message);
            alert("Fail");
            return;
        }
        alert("Success");
    };

    const Calculate = (e) => {
        e.preventDefault();
        let a = parseInt(A);
        let b = parseInt(B);
        let h = (b - a) / 2;
        let I = (h / 3) * (F(a) + 4 * (a + h) + F(b))
        let real = RealValue(a, b);
        console.log(h / 3 * (F(a) + 4 * F(a + h) + F(b)))
        console.log(I)
        let err = Math.abs((I - real) / I) * 100;
        setResultNormal(real);
        setResultTrap(I);
        setErr(err);


    }

    const RealValue = (a, b) => {
        const intgr = Algebrite.integral(Algebrite.eval(Func)).toString()
        return evaluate(intgr, { x: b }) - evaluate(intgr, { x: a });
    }


    const F = (x) => {
        return evaluate(Func, { x });
    }

    const HandleA = (e) => {
        setA(e.target.value)
    }

    const HandleB = (e) => {
        setB(e.target.value)
    }
    const handleFunc = (e) => {
        setFunc(e.target.value)
    }

    const handleOptionChangeFunc = async (e) => {
        const selectedEquation = e.target.value;
        const selected = data.find(item => item.equation === selectedEquation);

        if (selected) {
            console.log("Selected err:", selected.err);
            setFunc(selected.equation);
            setA(selected.a)
            setB(selected.b)
            setResultTrap(selected.answer1)
            setResultNormal(selected.answer2)
            setErr(selected.err)

        } else {
            console.error("Selected equation not found in data.");
        }
    };

    const ResetNew = () => {
        setA(0)
        setB(0)
        setResultNormal(0)
        setResultTrap(0)
        setErr(0)
    }
    return (
        <div>
            <div className="calculator-container">
                <form onSubmit={Calculate}>
                    <div className="form-container">
                        <div className="form-title" >
                            <h1 >Simpson Method Calculator</h1>
                        </div>
                        <div className='FormContainer'>
                            <input type='String' step="any" value={Func} onChange={handleFunc} placeholder='input function' />
                            <input type='number' step="any" value={A} onChange={HandleA} placeholder='input a' />
                            <input type='number' step="any" value={B} onChange={HandleB} placeholder='input b' />
                        </div>
                        <select onChange={handleOptionChangeFunc} className="option-form">
                            <option value={null}>Equation example</option>
                            {data.map((data) => (
                                <option key={data.id}>
                                    {`${data.equation}`}
                                </option>
                            ))}
                        </select>
                        <div className='button-container'>
                            <button type='submit' className="calculate" >Calculate</button>
                            <button type="button" className="calculate" onClick={ResetNew}>Reset</button>
                            <button type="button" className="calculate" onClick={PostDataBase}>Add Database</button>
                        </div>
                        <div className='Answer'>
                            <h2>Answer of Trapzoidal {resultTrap.toFixed(2)}</h2>
                            <h2>Answer of Exact value {resultNormal.toFixed(2)}</h2>
                            <h2>Error {Err.toFixed(2)}%</h2>
                        </div>
                    </div>
                </form>


            </div>
        </div>
    );

} export default Simpson;

