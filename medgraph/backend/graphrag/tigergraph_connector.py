"""
TigerGraph Connector for GraphRAG
Handles graph database queries and knowledge retrieval
"""

import json
from typing import List, Dict, Optional

class TigerGraphConnector:
    def __init__(self, host: str = "localhost", port: int = 9000):
        self.host = host
        self.port = port
        self.connected = False
        
        # Mock graph data for MVP (replace with actual TigerGraph connection)
        self.mock_graph = self._initialize_mock_graph()
    
    def _initialize_mock_graph(self) -> Dict:
        """Initialize mock knowledge graph"""
        return {
            'nodes': {
                'symptoms': [
                    {'id': 'chest_pain', 'name': 'Chest Pain', 'snomed': 'SNOMED:29857009'},
                    {'id': 'sob', 'name': 'Shortness of Breath', 'snomed': 'SNOMED:267036007'},
                    {'id': 'fatigue', 'name': 'Fatigue', 'snomed': 'SNOMED:84229001'}
                ],
                'diseases': [
                    {'id': 'angina', 'name': 'Angina Pectoris', 'icd10': 'I20.9'},
                    {'id': 'acs', 'name': 'Acute Coronary Syndrome', 'icd10': 'I24.9'},
                    {'id': 'gerd', 'name': 'GERD', 'icd10': 'K21.9'}
                ],
                'tests': [
                    {'id': 'ecg', 'name': 'ECG', 'type': 'diagnostic'},
                    {'id': 'troponin', 'name': 'Troponin Test', 'type': 'lab'}
                ]
            },
            'edges': [
                {'from': 'chest_pain', 'to': 'angina', 'type': 'SYMPTOM_OF', 'confidence': 0.85},
                {'from': 'sob', 'to': 'angina', 'type': 'SYMPTOM_OF', 'confidence': 0.72},
                {'from': 'chest_pain', 'to': 'acs', 'type': 'SYMPTOM_OF', 'confidence': 0.92},
                {'from': 'angina', 'to': 'ecg', 'type': 'DIAGNOSED_VIA', 'confidence': 0.92},
                {'from': 'acs', 'to': 'troponin', 'type': 'DIAGNOSED_VIA', 'confidence': 0.88}
            ]
        }
    
    def connect(self) -> bool:
        """Connect to TigerGraph instance"""
        # In production, use pyTigerGraph
        # conn = tg.TigerGraphConnection(host=self.host, graphname="MedGraph")
        self.connected = True
        return True
    
    def query_symptom_to_disease(self, symptoms: List[str], max_hops: int = 2) -> Dict:
        """
        Execute multi-hop GSQL query to find diseases connected to symptoms
        
        GSQL Query (production):
        CREATE QUERY symptom_to_disease(SET<STRING> symptoms, INT max_hops) {
            Start = {Symptom.*};
            Start = SELECT s FROM Start:s WHERE s.id IN symptoms;
            
            Results = SELECT t FROM Start:s -(SYMPTOM_OF:e)-> Disease:t
                      WHERE e.confidence > 0.5
                      ORDER BY e.confidence DESC;
            
            PRINT Results;
        }
        """
        # Mock implementation
        matching_diseases = []
        
        for symptom in symptoms:
            for edge in self.mock_graph['edges']:
                if edge['from'] == symptom and edge['type'] == 'SYMPTOM_OF':
                    disease_id = edge['to']
                    disease = next((d for d in self.mock_graph['nodes']['diseases'] if d['id'] == disease_id), None)
                    if disease:
                        matching_diseases.append({
                            'disease': disease,
                            'confidence': edge['confidence'],
                            'path': [symptom, disease_id]
                        })
        
        return {
            'diseases': matching_diseases,
            'query_time_ms': 45,
            'hops': max_hops
        }
    
    def get_recommended_tests(self, disease_ids: List[str]) -> List[Dict]:
        """Get recommended diagnostic tests for diseases"""
        tests = []
        
        for disease_id in disease_ids:
            for edge in self.mock_graph['edges']:
                if edge['from'] == disease_id and edge['type'] == 'DIAGNOSED_VIA':
                    test_id = edge['to']
                    test = next((t for t in self.mock_graph['nodes']['tests'] if t['id'] == test_id), None)
                    if test:
                        tests.append({
                            **test,
                            'confidence': edge['confidence']
                        })
        
        return tests
    
    def get_reasoning_path(self, symptom_id: str, disease_id: str) -> List[Dict]:
        """Get the reasoning path from symptom to disease"""
        path = []
        
        for edge in self.mock_graph['edges']:
            if edge['from'] == symptom_id and edge['to'] == disease_id:
                path.append({
                    'from': symptom_id,
                    'to': disease_id,
                    'relationship': edge['type'],
                    'confidence': edge['confidence']
                })
        
        return path
    
    def add_patient_context(self, patient_id: str, context: Dict) -> bool:
        """Add patient context to graph"""
        # In production, insert patient node and relationships
        return True
