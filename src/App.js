
import './App.css';
import Website from './components/webpage/WebPage';
import Bisection from './components/RootofEquation/bisection';
import Falseposition from './components/RootofEquation/Falsepositon';
import Graphical from './components/RootofEquation/graphical';
import Home from './components/webpage/Home';
import OnePoint from './components/RootofEquation/onepoint';
import Newton from './components/RootofEquation/newton';
import Secant from './components/RootofEquation/secant';
import Taylor from './components/RootofEquation/taylor';
import Gaussian from './components/linearalgebra/gaussian';
import GaussianEliminationJordan from './components/linearalgebra/gaussianjordan';
import MatrixInversion from './components/linearalgebra/matrixinversion';
import Largarnge from './components/Interpolation/largarnge';
import Cramer from './components/linearalgebra/cramer';
import ConjugateGradientMethod from './components/linearalgebra/ConjugateGradient';
import NewtonInter from './components/Interpolation/newtonInter';
import Trapzoidal from './components/intergral/Trapzoidal';
import CompositeTrapzoidal from './components/intergral/CompositeTrapzoidal';
import Simpson from './components/intergral/Simpson';
import CompositeSimpson from './components/intergral/CompositeSimpson';
//import Footer from './components/webpage/Footer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <div>
    <BrowserRouter>   
      <Website/>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/graphical" element={<Graphical/>} />
          <Route exact path="/bisection" element={<Bisection/>} />
          <Route exact path="/falseposition" element={<Falseposition/>} />
          <Route exact path="/onepoint" element={<OnePoint/>} />
          <Route exact path="/taylor" element={<Taylor/>} />
          <Route exact path="/newton" element={<Newton/>} />
          <Route exact path="/secant" element={<Secant/>} />
          <Route exact path="/cramer" element={<Cramer/>} /> 
          <Route exact path="/gaussian" element={<Gaussian/>} />   
          <Route exact path="/gaussianjordan" element={<GaussianEliminationJordan/>} />   
          <Route exact path="/matrixinversion" element={<MatrixInversion/>} /> 
          <Route exact path="/lagrange" element={<Largarnge/>} /> 
          <Route exact path="/newtonInterpolation" element={<NewtonInter/>} />
          <Route exact path="/Trapzoidal" element={<Trapzoidal/>} />
          <Route exact path="/CompositeTrapzoidal" element={<CompositeTrapzoidal/>} />
          <Route exact path="/Simpson" element={<Simpson/>} />
          <Route exact path="/CompositeSimpson" element={<CompositeSimpson/>} />
              
      
        </Routes>  
    </BrowserRouter>
    </div> 
  );
}

export default App;
