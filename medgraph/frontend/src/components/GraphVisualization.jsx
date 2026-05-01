import { useEffect, useRef, useState } from 'react'
import { Network, Maximize2, ZoomIn, ZoomOut } from 'lucide-react'
import './GraphVisualization.css'

function GraphVisualization({ graphData }) {
  const canvasRef = useRef(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [nodes] = useState([
    { id: 'chest-pain', label: 'Chest Tightness', type: 'symptom', x: 100, y: 200 },
    { id: 'sob', label: 'Shortness of Breath', type: 'symptom', x: 100, y: 300 },
    { id: 'angina', label: 'Angina Pectoris', type: 'disease', x: 400, y: 250 },
    { id: 'acs', label: 'Acute Coronary Syndrome', type: 'disease', x: 400, y: 350 },
    { id: 'age', label: 'Age: 52', type: 'risk-factor', x: 250, y: 100 },
    { id: 'hypertension', label: 'Hypertension', type: 'condition', x: 250, y: 400 },
    { id: 'ecg', label: 'ECG Test', type: 'test', x: 650, y: 250 },
    { id: 'troponin', label: 'Troponin', type: 'test', x: 650, y: 350 }
  ])

  const [edges] = useState([
    { from: 'chest-pain', to: 'angina', label: 'SYMPTOM_OF', confidence: 0.82 },
    { from: 'sob', to: 'angina', label: 'SYMPTOM_OF', confidence: 0.71 },
    { from: 'chest-pain', to: 'acs', label: 'SYMPTOM_OF', confidence: 0.68 },
    { from: 'age', to: 'angina', label: 'RISK_FACTOR', confidence: 0.18 },
    { from: 'hypertension', to: 'angina', label: 'COMORBIDITY', confidence: 0.15 },
    { from: 'angina', to: 'ecg', label: 'DIAGNOSED_VIA', confidence: 0.92 },
    { from: 'acs', to: 'troponin', label: 'DIAGNOSED_VIA', confidence: 0.88 }
  ])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const width = canvas.width = canvas.offsetWidth
    const height = canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw edges
    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from)
      const toNode = nodes.find(n => n.id === edge.to)
      
      if (fromNode && toNode) {
        ctx.beginPath()
        ctx.moveTo(fromNode.x, fromNode.y)
        ctx.lineTo(toNode.x, toNode.y)
        ctx.strokeStyle = `rgba(46, 134, 171, ${edge.confidence})`
        ctx.lineWidth = 2 + edge.confidence * 2
        ctx.stroke()

        // Draw edge label
        const midX = (fromNode.x + toNode.x) / 2
        const midY = (fromNode.y + toNode.y) / 2
        ctx.fillStyle = '#7F8C8D'
        ctx.font = '10px Inter'
        ctx.fillText(edge.label, midX, midY - 5)
      }
    })

    // Draw nodes
    nodes.forEach(node => {
      const colors = {
        symptom: '#3498DB',
        disease: '#E74C3C',
        'risk-factor': '#F39C12',
        condition: '#9B59B6',
        test: '#27AE60'
      }

      ctx.beginPath()
      ctx.arc(node.x, node.y, 30, 0, 2 * Math.PI)
      ctx.fillStyle = colors[node.type] || '#95A5A6'
      ctx.fill()
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 3
      ctx.stroke()

      // Draw label
      ctx.fillStyle = '#2C3E50'
      ctx.font = '12px Inter'
      ctx.textAlign = 'center'
      ctx.fillText(node.label, node.x, node.y + 50)
    })
  }, [nodes, edges])

  const handleNodeClick = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const clickedNode = nodes.find(node => {
      const dx = x - node.x
      const dy = y - node.y
      return Math.sqrt(dx * dx + dy * dy) < 30
    })

    if (clickedNode) {
      setSelectedNode(clickedNode)
    }
  }

  return (
    <div className="graph-visualization">
      <div className="graph-header">
        <h3><Network size={20} /> Live Knowledge Graph</h3>
        <div className="graph-controls">
          <button><ZoomIn size={16} /></button>
          <button><ZoomOut size={16} /></button>
          <button><Maximize2 size={16} /></button>
        </div>
      </div>

      <div className="graph-legend">
        <span><span className="legend-dot symptom"></span> Symptoms</span>
        <span><span className="legend-dot disease"></span> Diseases</span>
        <span><span className="legend-dot risk"></span> Risk Factors</span>
        <span><span className="legend-dot test"></span> Tests</span>
      </div>

      <canvas 
        ref={canvasRef} 
        className="graph-canvas"
        onClick={handleNodeClick}
      />

      {selectedNode && (
        <div className="node-details">
          <h4>{selectedNode.label}</h4>
          <p>Type: {selectedNode.type}</p>
          <p>Click edges to see relationships</p>
        </div>
      )}
    </div>
  )
}

export default GraphVisualization
