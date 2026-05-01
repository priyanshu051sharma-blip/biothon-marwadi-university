import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import TopNavigation from './components/TopNavigation'
import PatientDigitalTwin from './components/PatientDigitalTwin'
import AIIntelligenceHub from './components/AIIntelligenceHub'
import SmartCareNavigator from './components/SmartCareNavigator'
import GraphVisualization from './components/GraphVisualization'
import GraphRAGComparison from './components/GraphRAGComparison'
import ProactiveInsights from './components/ProactiveInsights'
import './App.css'

function App() {
  const [mode, setMode] = useState('patient') // patient or doctor
  const [currentAnalysis, setCurrentAnalysis] = useState(null)
  const [graphData, setGraphData] = useState(null)

  return (
    <Router>
      <div className="medgraph-app">
        <TopNavigation mode={mode} setMode={setMode} />
        
        <div className="main-layout">
          <div className="left-panel">
            <PatientDigitalTwin />
          </div>
          
          <div className="center-panel">
            <AIIntelligenceHub 
              setCurrentAnalysis={setCurrentAnalysis}
              setGraphData={setGraphData}
            />
            <ProactiveInsights />
          </div>
          
          <div className="right-panel">
            <SmartCareNavigator analysis={currentAnalysis} />
          </div>
        </div>
        
        <div className="bottom-panel">
          <GraphVisualization graphData={graphData} />
          <GraphRAGComparison />
        </div>
      </div>
    </Router>
  )
}

export default App
