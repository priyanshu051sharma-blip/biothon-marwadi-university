"""
Mock Notification Service for HealthAI Pro
Implements in-memory web socket tracking for local/demo runs
"""

from typing import Set

class NotificationService:
    def __init__(self):
        self.active_connections: Set = set()

    async def connect(self, websocket):
        """Register a new websocket connection"""
        await websocket.accept()
        self.active_connections.add(websocket)
        print(f"🔌 Websocket connection added. Total connections: {len(self.active_connections)}")

    async def disconnect(self, websocket):
        """De-register a websocket connection"""
        self.active_connections.remove(websocket)
        print(f"🔌 Websocket connection removed. Total connections: {len(self.active_connections)}")

    async def notify_doctor(self, patient_id: str, result: dict):
        """Notify connected doctor websockets of a diagnostic result"""
        print(f"📢 Notification: Patient {patient_id} result received: {result.get('diagnosis')}")
        # Send to all active websockets
        dead_connections = set()
        for connection in self.active_connections:
            try:
                await connection.send_json({
                    "type": "diagnostic_result",
                    "patient_id": patient_id,
                    "diagnosis": result.get("diagnosis"),
                    "confidence": result.get("confidence"),
                    "timestamp": result.get("timestamp", "")
                })
            except Exception:
                dead_connections.add(connection)
                
        # Clean up closed connections
        for conn in dead_connections:
            self.active_connections.remove(conn)
